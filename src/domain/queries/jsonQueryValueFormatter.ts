import FieldInfo from "../../models/fieldInfo";

function formatValueForSql(value: string, fieldInfo: FieldInfo) {
    const fieldType = fieldInfo.type;

    switch (fieldType) {
        case 'string':
            return `'${value}'`;
        case 'boolean':
            return `'${value}'`;
        case 'number': // For some reason numbers are managed this way for json
            return `'${value}'`;
        default:
            return `'${value}'`;
    }
}

export default {
    formatValueForSql
}