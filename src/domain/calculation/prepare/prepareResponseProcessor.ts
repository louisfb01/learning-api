import Redis from "../../../infrastructure/redis/redisDataProcessor";
import PrepareResponse from "../../../models/response/prepareResponse";
import Selector from "../../../models/request/selector";
import QueryDataResults from "../../queries/queryDataResults";
import Options from "../../../models/request/options"
import MLPRegressionModel from "../model/MLPRegressionModel";
import Field from "../../../models/request/field";
import FieldInfo from "../../../models/fieldInfo";
import fieldLabelFormatter from "../../queries/fieldLabelFormatter";
import dicomUIDFields from "../../resourceDicomUIDFields";
import dicomProxy from "../../../infrastructure/dicom/dicomProxy";
import redisDataProcessor from "../../../infrastructure/redis/redisDataProcessor";
import oneHotEncodedFields from "../../oneHotEncodedFields";
import MultiInputClassificationModel from "../model/MultiInputClassificationModel";
const tf = require('@tensorflow/tfjs-node');

async function getPrepareResponse(selector: Selector,
    options: Options,
    queryDataResults: QueryDataResults,
    jobID: string,
    fieldTypes: Map<Field, FieldInfo>): Promise<PrepareResponse> {

    const queryAndResult = queryDataResults.getSelectorResult(selector);

    if (queryAndResult.result instanceof Error) {
        return { job: jobID, error: queryAndResult.result.message, query: queryAndResult.query };
    }

    var inputs = options.inputs;
    const outputs = options.outputs;
    const result = queryAndResult.result;

    dicomUIDFieldTypes(selector, fieldTypes);
    const encodedDataset = await encodeDataset(result, fieldTypes, jobID, inputs, outputs);
    var dataset = minMaxScaleContinuous(encodedDataset, fieldTypes);
    dataset = createDataset(encodedDataset, inputs, outputs);

    await setUIDInfo(selector, options, dataset)
    const imagingUIDinfo = dataset.imageUIDlabel;

    if (imagingUIDinfo) {
        var TrainingModel = await MultiInputClassificationModel.createMultiInputClassificationModel([--inputs.length])
    }
    else {
        var TrainingModel = await MLPRegressionModel.createMLPRegressionModel([inputs.length]);
    }

    const modelJson = await MLPRegressionModel.serialize(TrainingModel);
    const weights = await MLPRegressionModel.saveWeights(TrainingModel);

    const response = {
        datasetRedisKey: await Redis.setRedisKey(JSON.stringify(dataset)),
        optionsRedisKey: await Redis.setRedisKey(JSON.stringify(options)),
        modelRedisKey: await Redis.setRedisKey(JSON.stringify(modelJson)),
        weightsRedisKey: await Redis.setRedisKey(weights)
    }

    const job = await Redis.setRedisJobId(JSON.stringify(response), jobID);
    const redisResult = {
        job: job,
        query: queryAndResult.query,
        count: dataset.xs.length,
        model: JSON.stringify(modelJson)
    }
    return redisResult;
}

async function encodeDataset(dataset: any, fieldTypes: Map<Field, FieldInfo>, jobID: string, inputs: string[], outputs: string[]) {
    const fieldsInfo = Array.from(fieldTypes.values());
    const fields = Array.from(fieldTypes.keys());
    const encodedDataset = await Promise.all(dataset.map(async (obj: any) => {
        for (let i = 0; i < fieldsInfo.length; i++) {
            let fieldName = fieldsInfo[i].name;
            let fieldType = fieldsInfo[i].type;
            let fieldPath = fields[i].path;
            let encodedFieldIndex = oneHotEncodedFields.values.findIndex(encodedField => encodedField.path == fieldPath);

            if (encodedFieldIndex > -1) {
                const categories = oneHotEncodedFields.values[encodedFieldIndex].categories;
                categories.forEach(element => {
                    const newFieldName = `${fieldName}_${element}`;
                    obj[newFieldName] = obj[fieldName] == element ? 1 : 0;
                    addEncodedFieldsToInputOutput(inputs, outputs, newFieldName, fieldName);
                });
                delete obj[fieldName];
                removeEncodedFieldFromInputOutput(inputs, outputs, fieldName);

            }
            else {
                switch (fieldType) {
                    case "TEXT":
                        obj[fieldName] = encodeString(obj[fieldName]);
                        break;
                    case "BOOLEAN":
                        obj[fieldName] = encodeBoolean(obj[fieldName]);
                        break;
                    case "DATE":
                        obj[fieldName] = encodeDate(obj[fieldName]);
                        break;
                    case "dicomSeriesUID":
                        obj[fieldName] = await encodeUID(obj[fieldName], jobID);
                        break;
                }
            }
        }
    }));
    return dataset;
}

function createDataset(dataset: any, inputs: string[], outputs: string[]) {
    let inputArray: any[] = [];
    let outputArray: any[] = [];
    inputs = inputs.map(label => {
        return fieldLabelFormatter.formatLabel(label)

    });
    outputs = outputs.map(label => {
        return fieldLabelFormatter.formatLabel(label)
    });

    loop: //use label to break/continue out of nested loop
    for (let obj of dataset) {
        let inputObj: any = {};
        let outputObj: any = {};
        for (let input of inputs) {
            if (obj[input] == null) {//clean out invalid data
                continue loop
            }
            inputObj[input] = obj[input]
        }
        for (let output of outputs) {
            if (obj[output] == null) {
                continue loop
            }
            outputObj[output] = obj[output]
        }

        inputArray.push(inputObj);
        outputArray.push(outputObj);
    };
    return { xs: inputArray, ys: outputArray };
}

async function setUIDInfo(selector: Selector, options: Options, dataset: any) {
    selector.fields.forEach(f => {
        const isUIDPathElement = dicomUIDFields.values.some(v => v === f.path);
        if (isUIDPathElement) {
            Object.assign(dataset, { imageUIDlabel: f.label })
        }
    })
    if (selector.joins) {
        setUIDInfo(selector.joins, options, dataset);
    }
}

function dicomUIDFieldTypes(selector: Selector, fieldTypes: Map<Field, FieldInfo>) {
    selector.fields.forEach(f => {
        const isUIDPathElement = dicomUIDFields.values.some(v => v === f.path);
        if (isUIDPathElement) {
            const fieldLabelNormalized = fieldLabelFormatter.formatLabel(f.label);
            const fieldInfo: FieldInfo = {
                name: fieldLabelNormalized,
                type: "dicomSeriesUID"
            };
            fieldTypes.set(f, fieldInfo);
        }
    })
    if (selector.joins) {
        dicomUIDFieldTypes(selector.joins, fieldTypes)
    }
}

function encodeDate(value: string) {
    return new Date(value).getTime();
}

function encodeString(value: string) {
    return hashCode(value);
}

function encodeBoolean(value: boolean) {
    return value ? 1 : 0;
}

async function encodeUID(dicomSeriesUID: string, jobID: string) {

    const formattedSeriesUID = dicomSeriesUID.replace(/['"]+/g, '')
    const seriesMetadata = await dicomProxy.getStudyUID(formattedSeriesUID);
    const studyUID = seriesMetadata[0][`0020000D`].Value[0];
    const instances = await dicomProxy.getInstanceUID(formattedSeriesUID, studyUID);
    const instanceUID = instances[0][`00080018`].Value[0];
    const imgData = await dicomProxy.getInstanceFrame(instanceUID);

    const utf8ImageData = Buffer.from(imgData).toString("base64"); //save to int8
    var redisKey = `images/${jobID}/${formattedSeriesUID}`;
    redisKey = await redisDataProcessor.setRedisJobId(utf8ImageData, redisKey);
    return redisKey;
}

async function mockEncodeUID(dicomSeriesUID: string, jobID: string) {
    dicomSeriesUID = "1.2.840.113619.2.176.2025.1499492.7391.1171285944.393" //temp
    var instanceUID = "1.3.6.1.4.1.14519.5.2.1.2193.7172.863063138942128758032875897774"
    while (instanceUID == "1.3.6.1.4.1.14519.5.2.1.2193.7172.863063138942128758032875897774" || instanceUID == "1.3.6.1.4.1.14519.5.2.1.2193.7172.227588763982019545194084732872") {
        const studies = await dicomProxy.getAllStudies();
        const studiesURL = studies.map((s: any) => {
            return s["0020000D"]["Value"][0];
        })
        const studyURL = studiesURL[Math.floor(Math.random() * studiesURL.length)]
        const series = await dicomProxy.getAllSeries(studyURL);
        const seriesURL = series.map((s: any) => {
            return s["0020000E"]["Value"][0];
        })
        dicomSeriesUID = seriesURL[Math.floor(Math.random() * seriesURL.length)];
        const seriesMetadata = await dicomProxy.getStudyUID(dicomSeriesUID);
        const studyUID = seriesMetadata[0][`0020000D`].Value[0];
        const instances = await dicomProxy.getInstanceUID(dicomSeriesUID, studyUID);
        instanceUID = instances[Math.floor(Math.random() * instances.length)][`00080018`].Value[0] //temp
    }
    const imgData = await dicomProxy.getInstanceFrame(instanceUID);

    const utf8ImageData = Buffer.from(imgData).toString("base64"); //save to int8
    var redisKey = `images/${jobID}/${dicomSeriesUID}`;
    redisKey = await redisDataProcessor.setRedisJobId(utf8ImageData, redisKey);
    return redisKey;
}

//todo: augment image data(flip, add noise, change brightness, shift)
//balance output categories

function hashCode(value: string) {
    let h = 0;
    for (let i = 0; i < value.length; i++)
        h = Math.imul(31, h) + value.charCodeAt(i) | 0;

    return h;
}

function addEncodedFieldsToInputOutput(inputs: string[], outputs: string[], newFieldName: string, oldFieldName: string) {
    let inputIndex = inputs.findIndex(e => e == oldFieldName)
    let outputIndex = outputs.findIndex(e => e == oldFieldName)
    if (inputIndex >= 0) {
        inputs.push(newFieldName);
    }
    else if (outputIndex >= 0) {
        outputs.push(newFieldName);
    }
    return
}

function removeEncodedFieldFromInputOutput(inputs: string[], outputs: string[], oldFieldName: string) {
    let inputIndex = inputs.findIndex(e => e == oldFieldName)
    let outputIndex = outputs.findIndex(e => e == oldFieldName)
    if (inputIndex >= 0) {
        inputs.splice(inputIndex, 1);
    }
    else if (outputIndex >= 0) {
        outputs.splice(outputIndex, 1);
    }
    return
}

function minMaxScaleContinuous(dataset: any, fieldTypes: Map<Field, FieldInfo>) {
    const fields = Array.from(fieldTypes.values()).filter(f => f.type == "FLOAT")
    // X_std = (X - X.min) / (X.max - X.min)
    // X_scaled = X_std * (max - min) + min -> use if min max of scale is not 0,1
    fields.forEach(field => {
        let xMin = Math.min(...dataset.map((d: any) => d[field.name]));
        let xMax = Math.max(...dataset.map((d: any) => d[field.name]));
        dataset = dataset.map((data: any) => {
            let x = data[field.name];
            let xStd = (x - xMin) / (xMax - xMin);
            data[field.name] = xStd;
            return data
        })
    })
    return dataset
}

export default {
    getPrepareResponse
}