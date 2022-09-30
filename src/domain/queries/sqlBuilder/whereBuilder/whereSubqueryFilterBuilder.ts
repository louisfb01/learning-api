import FieldInfo from "../../../../models/fieldInfo";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import fieldPathFormatter from "../../fieldPathFormatter";
import jsonFilterOperatorFormatter from "../../../queries/jsonFilterOperatorFormatter";
import jsonQueryValueFormatter from "../../../queries/jsonQueryValueFormatter";

function getFilterNormalized(filter: Filter, filterFields: Map<Filter, FieldInfo>, subqueryName: string) {
    const fieldInfo = filterFields.get(filter);
    if (!fieldInfo) throw new Error('No matching field for filter.')

    const filterPathNormalized = `${subqueryName}.${fieldPathFormatter.formatPath(filter.path)}`;
    const filterValue = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);
    const sqlOperant = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

    return `${filterPathNormalized} ${sqlOperant} ${filterValue}`;
}

function build(selector: Selector, filterFields: Map<Filter, FieldInfo>, subqueryName: string) {
    const filtersNormalized = selector.filters.map(f => getFilterNormalized(f, filterFields, subqueryName));

    return filtersNormalized.join(' AND ');
}

export default {
    build
}