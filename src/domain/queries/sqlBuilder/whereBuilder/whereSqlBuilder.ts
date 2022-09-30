import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import GroupBySqlBuilder from "../groupByBuilder/groupBySqlBuilder";
import SqlBuilder from "../sqlBuilder";
import whereBuilder from "./whereBuilder";
import whereFieldFilterBuilder from "./whereFieldFilterBuilder";
import whereSubqueryFilterBuilder from "./whereSubqueryFilterBuilder";
import limitBuilder from "../limitBuilder/limitBuilder";

export default class WhereSqlBuilder {
    sqlBuilder: SqlBuilder;

    constructor(sqlBuilder: SqlBuilder) {
        this.sqlBuilder = sqlBuilder;
        this.sqlBuilder.requestBuilders.push(whereBuilder.build);
    }

    fieldFilter(possibleComputedField?: Field) {
        const builderFunction = (selector: Selector, filterFields: Map<Filter, FieldInfo>) => {
            return whereFieldFilterBuilder.build(selector, filterFields, possibleComputedField);
        }

        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }

    subqueryFilter(subqueryName: string) {
        const builderFunction = (selector: Selector, filterFields: Map<Filter, FieldInfo>) => {
            return whereSubqueryFilterBuilder.build(selector, filterFields, subqueryName);
        }

        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }

    groupBy() {
        const groupByBuilder = new GroupBySqlBuilder(this.sqlBuilder);
        return groupByBuilder;
    }

    limit(){
        this.sqlBuilder.requestBuilders.push(limitBuilder.build);
        return this;
    }

    build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) {
        return this.sqlBuilder.build(selector, filterFieldTypes);
    }
}