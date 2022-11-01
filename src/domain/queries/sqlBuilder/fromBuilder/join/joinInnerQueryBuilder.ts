import FieldInfo from "../../../../../models/fieldInfo";
import Field from "../../../../../models/request/field";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import arrayFieldDetector from "../../../fields/arrayFieldDetector";
import SqlBuilder from "../../sqlBuilder";

function build(joinSelector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>) {
    const sqlBuilder = new SqlBuilder()
        .select()

    if(hasFields(joinSelector)){
        sqlBuilder.fieldsJson().comma();
    }

    if (joinSelector.filters.length === 0) return sqlBuilder.joinId().from().resourceTable().possibleJoin(fieldTypes).build(joinSelector, filterTypes);

    const hasArrayFilters = joinSelector.filters.some(f => arrayFieldDetector.isArrayField(f.path));

    const builderWithFilter = hasArrayFilters
        ? sqlBuilder.joinId().from().resourceTable().crossJoinForArrayFilters().possibleJoin(fieldTypes).where().fieldFilter()
        : sqlBuilder.joinId().from().resourceTable().possibleJoin(fieldTypes).where().fieldFilter();

    return builderWithFilter.build(joinSelector, filterTypes);
}

function hasFields(selector: Selector): boolean {
    if(selector.fields.length > 0)
        return true
    else if(selector.joins)
        return hasFields(selector.joins)
    return false
}

export default {
    build
}