import Redis from "../../../infrastructure/redis/redisDataProcessor";
import MLPRegressionModel from "../model/MLPRegressionModel";
import EvaluateResponse from "../../../models/response/evaluateResponse";

const tf = require('@tensorflow/tfjs-node');

async function getEvaluateResponse(jobID: string, hubWeights: any): Promise<EvaluateResponse> {
    let redisKeys: any = await Redis.getRedisKey(jobID);

    redisKeys = await JSON.parse(redisKeys);
    
    const datasetRedisKey = redisKeys.datasetRedisKey;
    const optionsRedisKey = redisKeys.optionsRedisKey;
    const modelRedisKey = redisKeys.modelRedisKey;
    const weightsRedisKey = redisKeys.weightsRedisKey;

    const datasetStr = await Redis.getRedisKey(datasetRedisKey);
    const optionsStr = await Redis.getRedisKey(optionsRedisKey);
    const modelStr = await Redis.getRedisKey(modelRedisKey);
    const weights = hubWeights? hubWeights : await Redis.getRedisKey(weightsRedisKey);

    const options = await JSON.parse(optionsStr);
    const datasetJson = await JSON.parse(datasetStr);
    const modelJson = await JSON.parse(modelStr);

    const xs = await tf.data.array(datasetJson.xs);
    const ys = await tf.data.array(datasetJson.ys);
    const flattenedLabelset = await
        ys
        .map((data:any) =>
        {
            return Object.values(data)
        })
    const flattenedFeatureset = await
        xs
        .map((data:any) =>
        {
            return Object.values(data)
        })
    const datasetObj = await tf.data.zip({xs: flattenedFeatureset, ys:flattenedLabelset});

     
    //training model
    const EvaluateModel = await MLPRegressionModel.deserialize(modelJson, weights);
    const learningRate = options.optimizer.parameters.learning_rate;
    const optimizer = options.optimizer.name;
    const loss = options.compiler.parameters.loss;
    const metrics = options.compiler.parameters.metrics;
    await EvaluateModel.compile({optimizer: tf.train[`${optimizer}`](learningRate), loss: loss, metrics: metrics});
    const datasetLength = Object.keys(datasetJson.xs).length;
    const evaluationSplit = options.optimizer.parameters.evaluation_split;
    const batchSize = options.optimizer.parameters.batch_size;
    const shuffle = options.optimizer.parameters.shuffle;
    const dataset = datasetObj.take(Math.floor(datasetLength * evaluationSplit)).shuffle(shuffle).batch(batchSize); //get evaluation dataset

    let result = await EvaluateModel.evaluateDataset(dataset);

    const responseMetrics = {
        loss: result[0].dataSync()[0],
        acc: result[1].dataSync()[0],
    }

    const responseModel = await MLPRegressionModel.serialize(EvaluateModel);
    await Redis.setRedisJobId(responseModel, modelRedisKey)

    const evaluateResponse = {
        job: jobID,
        metrics: responseMetrics
    };
    return evaluateResponse
}

export default {
    getEvaluateResponse
}