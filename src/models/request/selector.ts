import Field from "./field";
import Filter from "./filter";

export default interface Selector {
    resource: string;
    filters: Filter[];
    fields: Field[];
    joins?: Selector;
}