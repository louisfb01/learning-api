import Selector from "./selector";
import Options from "./options";

export default interface PrepareRequestBody {
    selectors: Selector[];
    options: Options;
    job: string;
}