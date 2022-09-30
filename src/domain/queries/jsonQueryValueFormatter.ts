import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";

function formatValueForSql(filter: Filter, fieldInfo: FieldInfo) {
    const value = String(filter.value);

    const filterOperator = filter.operator.replace(/_/g, '').toLowerCase();
    if(String(value).toLowerCase() === 'null' && ['is', 'equals', 'on', 'equal'].some(op => op === filterOperator)) return value;

    const fieldType = fieldInfo.type;

    switch (fieldType) {
        case 'TEXT':
            return `'${value}'`;
        case 'BOOLEAN':
            return `'${value}'`;
        case 'FLOAT': // For some reason numbers are managed this way for json
            return `${value}`;
        default:
            return `'${value}'`;
    }
}

function formatIndexValueForSql(value: string, path: string){
    const pathArray = path.split(".");
    const lastPath = pathArray[pathArray.length -1]
    return `'[{"${lastPath}":"${value}"}]'`
}
export default {
    formatValueForSql, formatIndexValueForSql
}