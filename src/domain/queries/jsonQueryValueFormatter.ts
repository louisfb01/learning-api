import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";

function formatValueForSql(filter: Filter, fieldInfo: FieldInfo) {
    const value = String(filter.value);

    const filterOperator = filter.operator.replace(/_/g, '').toLowerCase();
    if(String(value).toLowerCase() === 'null' && ['is', 'equals', 'on', 'equal'].some(op => op === filterOperator)) return value;
    const fieldType = fieldInfo.type.toLowerCase();

    switch (fieldType) {
        case 'text':
            return `'${value}'`;
        case 'boolean':
            return `${value}`;
        case 'float':
            return `${value}`;
        default:
            return `'${value}'`;
    }
}

function formatIndexValueForSql(value: string | boolean | number, path: string){
    const pathArray = path.split(".");
    const lastPath = pathArray[pathArray.length -1]
    return `'[{"${lastPath}":"${value}"}]'`
}
export default {
    formatValueForSql, formatIndexValueForSql
}