const tf = require('@tensorflow/tfjs-node');
        /**
     * Builds and returns Multi Layer Perceptron Regression Model.
     *
     * @param {number} inputShape The input shape of the model.
     * @returns {tf.Sequential} The multi layer perceptron regression mode  l.
     */
  async function createMLPRegressionModel(inputShape: number[]){
      const model = tf.sequential();
      model.add(tf.layers.dense({
        inputShape: inputShape,
        activation: 'relu',
        units: 20,
      }));
      model.add(tf.layers.dropout({
        rate: 0.1,
      }))
      model.add(tf.layers.dense({
        activation: 'relu',
        units: 10,
      }));
      model.add(tf.layers.dense({
        activation: 'sigmoid',
        units: 1,
      }));
      model.compile({optimizer: tf.train.adam(0.0005), loss: 'binaryCrossentropy'});
      return model;
    }

  async function saveWeights(model:any){
    let result = await model.save(tf.io.withSaveHandler(async (modelArtifacts: any) => modelArtifacts));
    result.weightData = Buffer.from(result.weightData);
    console.log("weightData",result.weightData)
    console.log("isbuffer", Buffer.isBuffer(result.weightData))
    return result.weightData;
  }

  async function serialize(model: any){
    let result = await model.save(tf.io.withSaveHandler(async (modelArtifacts: any) => modelArtifacts));
    delete result.weightData;
    // result.weights = []
    // for (let i = 0; i < model.getWeights().length; i++) {
    //   result.weights.push(model.getWeights()[i].dataSync().toString());
    // }
    return result;
  }

  async function deserialize(json: any, weights: any){
      const weightData = new Uint8Array(Buffer.from(weights)).buffer;
      const modelArtifacts = {
        modelTopology: json.modelTopology, 
        weightSpecs: json.weightSpecs, 
        weightData: weightData}
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
  createMLPRegressionModel, serialize, deserialize, saveWeights
 }