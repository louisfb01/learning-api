import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import SqlBuilder from "../sqlBuilder";
import groupByBuilder from "./groupByBuilder";
import groupByCompiledFieldBuilder from "./groupByCompiledFieldBuilder";
import groupByFieldBuilder from "./groupByFieldBuilder";

export default class GroupBySqlBuilder {

    sqlBuilder: SqlBuilder;

    constructor(sqlBuilder: SqlBuilder) {
        this.sqlBuilder = sqlBuilder;
        this.sqlBuilder.requestBuilders.push(groupByBuilder.build);
    }

    field(field: Field) {
        const builderFunction = () => groupByFieldBuilder.build(field);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) {
        return this.sqlBuilder.build(selector, filterFieldTypes);
    }

    compiledField(compiledFieldName: string) {
        const builderFunction = () => groupByCompiledFieldBuilder.build(compiledFieldName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }
}