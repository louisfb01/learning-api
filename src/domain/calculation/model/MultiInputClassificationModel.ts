export type variableType = 'categorical' | 'continuous' | 'tensor'
const tf = require('@tensorflow/tfjs-node');
/**
* Builds and returns Multi Layer Perceptron Regression Model.
*
* @param {number} mlpInputShape The input shape of the mlp model.
* @returns {tf.Sequential} The multi layer perceptron regression mode  l.
*/
async function createMultiInputClassificationModel(mlpInputShape: number[]) {
  const width = 512
  const height = 512
  const depth = 1;

  const myInput1 = tf.input({ shape: mlpInputShape, name: 'myInput1' });
  const myInput1Dense1 = tf.layers.dense({ units: 20, activation: 'relu', name: 'myInput1Dense1' }).apply(myInput1);
  const myInput1Dense2 = tf.layers.dense({ units: 20, activation: 'relu', name: 'myInput1Dense2' }).apply(myInput1Dense1);
  const output1 = tf.layers.dense({ units: 5, activation: 'relu', name: 'output1' }).apply(myInput1Dense2)

  const myInput2 = tf.input({ shape: [width, height, depth], name: 'myInput2' });
  const conv2d_1 = tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu', name: 'conv2d_1' }).apply(myInput2);
  const conv2d_1_bn = tf.layers.batchNormalization().apply(conv2d_1);
  const conv2d_1_bn_pooled = tf.layers.maxPooling2d({ poolSize: [2, 2] }).apply(conv2d_1_bn);

  const flatten = tf.layers.flatten().apply(conv2d_1_bn_pooled);
  const output2 = tf.layers.dense({ units: 5, activation: 'relu', name: 'output2' }).apply(flatten)
  // console.log(output1.shape)
  // console.log(output2.shape)

  const output = tf.layers.concatenate().apply([output1, output2]);
  var model = tf.model({ inputs: [myInput1, myInput2], outputs: output });

  await model.compile({ optimizer: tf.train.adam(0.0005), loss: 'binaryCrossentropy' });
  return model
}

async function saveWeights(model: any) {
  let result = await model.save(tf.io.withSaveHandler(async (modelArtifacts: any) => modelArtifacts));
  result.weightData = Buffer.from(result.weightData);
  console.log("weightData", result.weightData)
  console.log("isbuffer", Buffer.isBuffer(result.weightData))
  return result.weightData;
}

async function serialize(model: any) {
  let result = await model.save(tf.io.withSaveHandler(async (modelArtifacts: any) => modelArtifacts));
  delete result.weightData;
  // result.weights = []
  // for (let i = 0; i < model.getWeights().length; i++) {
  //   result.weights.push(model.getWeights()[i].dataSync().toString());
  // }
  return result;
}

async function deserialize(json: any, weights: any) {
  const weightData = new Uint8Array(Buffer.from(weights)).buffer;
  const modelArtifacts = {
    modelTopology: json.modelTopology,
    weightSpecs: json.weightSpecs,
    weightData: weightData
  }
  let loadedModel = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts));
  // let newWeights = []
  // for (let i = 0; i < loadedModel.getWeights().length; i++) {
  //   let weight = weightData[i].split(",")
  //   newWeights.push(tf.tensor(new Float32Array(weight), json.weightSpecs[i].shape))
  // }
  // loadedModel.setWeights(newWeights);
  return loadedModel;
}

export default {
  createMultiInputClassificationModel, serialize, deserialize, saveWeights
}