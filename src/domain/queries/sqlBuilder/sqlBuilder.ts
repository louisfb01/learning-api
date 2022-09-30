import FieldInfo from "../../../models/fieldInfo";
import Filter from "../../../models/request/filter";
import Selector from "../../../models/request/selector";
import SelectSqlBuilder from "./selectBuilder/selectSqlBuilder";

export default class SqlBuilder {
    requestBuilders: Array<(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) => string>;

    constructor() {
        this.requestBuilders = new Array<(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) => string>();
    }

    build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) {
        return this.requestBuilders.map(rq => rq(selector, filterFieldTypes)).join(' ');
    }

    select() {
        const selectBuilder = new SelectSqlBuilder(this);
        return selectBuilder;
    }
}