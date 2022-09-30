import fieldLabelFormatter from "../fieldLabelFormatter";
import jsonTypePathCompiler from "../../queries/jsonTypePathCompiler";
import Field from "../../../models/request/field";
import calculatedFields from "../../calculatedFields";


function getQuery(field: Field): string {
    const fieldPath = field.path;
    const fieldLabel = field.label;
    const jsonTypePathCompiled = jsonTypePathCompiler.getPathCompiled(fieldPath);
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(fieldLabel);

    return `${jsonTypePathCompiled} AS ${fieldLabelFormatted}`;
}

function getQueryfromLabel(field: Field): string {
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);
    
    const calculatedField = calculatedFields.calculatedFields.get(field.path);
    if (calculatedField) {
        return `pg_typeof(${fieldLabelFormatted}) as ${fieldLabelFormatted}`;
    }
    
    return `jsonb_typeof(${fieldLabelFormatted}) AS ${fieldLabelFormatted}`
}

export default {
    getQuery, getQueryfromLabel
}


