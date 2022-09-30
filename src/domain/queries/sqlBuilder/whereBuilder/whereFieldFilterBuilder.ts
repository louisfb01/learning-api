import FieldInfo from "../../../../models/fieldInfo";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import jsonFieldValuePathCompiler from "../../../queries/jsonFieldValuePathCompiler";
import jsonFilterOperatorFormatter from "../../../queries/jsonFilterOperatorFormatter";
import jsonQueryValueFormatter from "../../../queries/jsonQueryValueFormatter";
import arrayFieldDetector from "../../fields/arrayFieldDetector";
import WhereJsonArrayFormatterBuilder from "./whereJsonArrayFormatterBuilder";

function getFilterNormalized(filter: Filter, filterFields: Map<Filter, FieldInfo>): string {
    const fieldInfo = filterFields.get(filter);
    if (!fieldInfo) throw new Error('No matching field for filter.')

    const isArrayField = arrayFieldDetector.isArrayField(filter.path);
    const jsonFieldValuePathCompiled = isArrayField
        ? new WhereJsonArrayFormatterBuilder(filter.path).build()
        : jsonFieldValuePathCompiler.getPathCompiled(filter.path);

    const filterValue = jsonQueryValueFormatter.formatValueForSql(filter.value, fieldInfo);
    const sqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

    return `${jsonFieldValuePathCompiled} ${sqlOperand} ${filterValue}`;
}

function build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) {
    const filtersNormalized = selector.filters.map(f => getFilterNormalized(f, filterFieldTypes));

    return filtersNormalized.join(' AND ');
}

export default {
    build
}