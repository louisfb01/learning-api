import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import arrayFieldDetector from "./fields/arrayFieldDetector";
import SqlBuilder from "./sqlBuilder/sqlBuilder";

function getQuery(selector: Selector,
    filterTypes: Map<Filter, FieldInfo>,
    fieldTypes: Map<Field, FieldInfo>): string {

    const sqlBuilder = new SqlBuilder()
        .select()
        .castedFields(selector, fieldTypes)
        .from()
        .resourceTable();

    if (selector.filters.length === 0) return sqlBuilder.possibleJoin().build(selector, filterTypes);

    const hasArrayFilters = selector.filters.some(f => arrayFieldDetector.isArrayField(f.path));

    const builderWithFilter = hasArrayFilters
        ? sqlBuilder.crossJoinForArrayFilters().possibleJoin().where().fieldFilter()
        : sqlBuilder.possibleJoin().where().fieldFilter();
    return builderWithFilter.build(selector, filterTypes);
}

export default {
    getQuery
}