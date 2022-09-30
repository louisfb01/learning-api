import Redis from "../../../infrastructure/redis/redisDataProcessor";
import TrainResponse from "../../../models/response/trainResponse";
import MLPRegressionModel from "../model/MLPRegressionModel";

const tf = require('@tensorflow/tfjs-node');

async function getTrainResponse(jobID: string, weights: any): Promise<TrainResponse> {

    let redisKeys: any = await Redis.getRedisKey(jobID);

    redisKeys = await JSON.parse(redisKeys);
    
    const datasetRedisKey = redisKeys.datasetRedisKey;
    const optionsRedisKey = redisKeys.optionsRedisKey;
    const modelRedisKey = redisKeys.modelRedisKey;

    const datasetStr = await Redis.getRedisKey(datasetRedisKey);
    const optionsStr = await Redis.getRedisKey(optionsRedisKey);
    const modelStr = await Redis.getRedisKey(modelRedisKey);

    const options = await JSON.parse(optionsStr);
    const datasetJson = await JSON.parse(datasetStr);

    let modelJson = {};
    if(weights != undefined){
        modelJson = weights
    }
    else{
        modelJson = await JSON.parse(modelStr);
    }
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
    const TrainingModel = await MLPRegressionModel.deserialize(modelJson);
    const learningRate = options.optimizer.parameters.learning_rate;
    const optimizer = options.optimizer.name;
    const loss = options.compiler.parameters.loss;
    const metrics = options.compiler.parameters.metrics;
    await TrainingModel.compile({optimizer: tf.train[`${optimizer}`](learningRate), loss: loss, metrics: metrics});
    const datasetLength = datasetJson.xs.length;
    const validationSplit = options.optimizer.parameters.validation_split;
    const evaluationSplit = options.optimizer.parameters.evaluation_split;
    const batchSize = options.optimizer.parameters.batch_size;
    const epochs = options.optimizer.parameters.epochs;
    const shuffle = options.optimizer.parameters.shuffle;
    const dataset = datasetObj.skip(Math.floor(datasetLength * evaluationSplit)).shuffle(shuffle).batch(batchSize); //skip evaluation dataset
    const trainDatasetLength = Math.floor((1 - validationSplit - evaluationSplit) * datasetLength);
    const trainBatches = Math.floor(trainDatasetLength / batchSize);

    const trainDataset = dataset.take(trainBatches);
    const validationDataset = dataset.skip(trainBatches);

    let history = await TrainingModel.fitDataset(
        trainDataset, {epochs: epochs, validationData: validationDataset}
    );

    const result = TrainingModel.predict(
        tf.tensor2d([[0, 22, 12.708312234248]]));
    console.log(result.dataSync());
    
    const responseMetrics = {
        acc: history.history.acc[epochs-1],
        loss: history.history.loss[epochs-1],
        val_acc: history.history.val_acc[epochs-1],
        val_loss: history.history.val_loss[epochs-1],
    }
    //serialize to send weights as response
    const responseModel = await MLPRegressionModel.serialize(TrainingModel);
    await Redis.setRedisJobId(responseModel, modelRedisKey)

    const trainResponse = {
        job: jobID,
        weights: responseModel,
        metrics: responseMetrics
    };
    return trainResponse
}

export default {
    getTrainResponse,
}