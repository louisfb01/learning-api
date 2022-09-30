import OptimizerParameters from "./optimizerParameters";

export default interface Optimizer {
    name: string;
    parameters: OptimizerParameters;
}