import FieldInfo from "../../../../../models/fieldInfo";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import arrayFieldDetector from "../../../fields/arrayFieldDetector";
import SqlBuilder from "../../sqlBuilder";

function build(selector: Selector, joinSelector: Selector, filterTypes: Map<Filter, FieldInfo>) {
    const sqlBuilder = new SqlBuilder()
        .select()
        .fields()
        .comma()
        .joinId(selector)
        .from()
        .resourceTable();

    if (joinSelector.filters.length === 0) return sqlBuilder.possibleJoin().build(joinSelector, filterTypes);

    const hasArrayFilters = joinSelector.filters.some(f => arrayFieldDetector.isArrayField(f.path));

    const builderWithFilter = hasArrayFilters
        ? sqlBuilder.crossJoinForArrayFilters().possibleJoin().where().fieldFilter()
        : sqlBuilder.possibleJoin().where().fieldFilter();

    return builderWithFilter.build(joinSelector, filterTypes);
}

export default {
    build
}