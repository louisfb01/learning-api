import Redis from "../../../infrastructure/redis/redisDataProcessor";
import PrepareResponse from "../../../models/response/prepareResponse";
import Selector from "../../../models/request/selector";
import QueryDataResults from "../../queries/queryDataResults";
import Options from "../../../models/request/options"
import MLPRegressionModel from "../model/MLPRegressionModel";
import Field from "../../../models/request/field";
import FieldInfo from "../../../models/fieldInfo";
import fieldLabelFormatter from "../../queries/fieldLabelFormatter";
const tf = require('@tensorflow/tfjs-node');

async function getPrepareResponse(selector: Selector, 
    options: Options, 
    queryDataResults: QueryDataResults, 
    jobID: string, 
    fieldTypes: Map<Field, FieldInfo>): Promise<PrepareResponse> {

    const queryAndResult = queryDataResults.getSelectorResult(selector);

    if (queryAndResult.result instanceof Error) {
        return {job: jobID, error: queryAndResult.result.message, query: queryAndResult.query };
    }

    const inputs = options.inputs;
    const outputs = options.outputs;
    const result = queryAndResult.result; 
    const encodedDataset = encodeDataset(result, fieldTypes);
    const dataset = createDataset(encodedDataset, inputs, outputs);
    const TrainingModel = await MLPRegressionModel.createMLPRegressionModel([inputs.length]);
    const modelJson = await MLPRegressionModel.serialize(TrainingModel);
    
    const response = {
        datasetRedisKey: await Redis.setRedisKey(dataset),
        optionsRedisKey: await Redis.setRedisKey(options),
        modelRedisKey: await Redis.setRedisKey(modelJson)
    }
    const job = await Redis.setRedisJobId(response, jobID);
    const redisResult = {
        job: job,
        query: queryAndResult.query,
        count: dataset.xs.length,
        totalCount: result.length
    }
    return redisResult;
}

function encodeDataset(dataset: any, fieldTypes: Map<Field, FieldInfo>){
    const fields = Array.from(fieldTypes.values())
    dataset.forEach(((obj: any) => {
            for(let i = 0; i<fields.length; i++){
                let fieldName = fields[i].name;
                let fieldType = fields[i].type;
                if(fieldName == 'gender'){
                    obj[fieldName] = encodeGender(obj[fieldName])
                }
                else{
                    switch(fieldType){
                        case "TEXT":
                            obj[fieldName] = encodeString(obj[fieldName])
                            break;
                        case "BOOLEAN":
                            obj[fieldName] = encodeBoolean(obj[fieldName])
                            break;
                    }
                }
            }
        }));
    return dataset;
}

function createDataset(dataset: any, inputs: string[], outputs: string[]){
    let inputArray: any[] = [];
    let outputArray: any[] = [];
    inputs = inputs.map(label => {
        return fieldLabelFormatter.formatLabel(label)
        
    });
    outputs = outputs.map(label => {
        return fieldLabelFormatter.formatLabel(label)
    });

    loop: //use label to break/continue out of nested loop
    for(let obj of dataset) {
        let inputObj:any= {};
        let outputObj:any = {};
        for(let input of inputs){
            if(obj[input]==null){
                continue loop
            }
            inputObj[input] = obj[input]
        }
        for(let output of outputs){
            if(obj[output]==null){
                continue loop
            }
            outputObj[output] = obj[output]
        }

        inputArray.push(inputObj);
        outputArray.push(outputObj);
    };
    return {xs: inputArray, ys: outputArray};
}

function encodeGender(value: string){
    return {'male':1, 'female':0, 'other':2, 'unknown':3}[value];
}

function encodeString(value: string){
    return hashCode(value);
}

function encodeBoolean(value: boolean){
    return value ? 1 : 0;
}

function hashCode(value: string) {
    let h=0;
    for(let i = 0; i < value.length; i++) 
          h = Math.imul(31, h) + value.charCodeAt(i) | 0;

    return h;
}

export default {
    getPrepareResponse
}