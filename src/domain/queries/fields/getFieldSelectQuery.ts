import fieldLabelFormatter from "../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../queries/jsonFieldValuePathCompiler";
import Field from "../../../models/request/field";
import calculatedFields from "../../calculatedFields";


function getQuery(field: Field): string {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    return `${jsonFieldPathCompiled} AS ${fieldLabelFormatted}`;
}

function getJsonQuery(field: Field): string {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getJsonPathCompiled(fieldPath);

    return `${jsonFieldPathCompiled} AS ${fieldLabelFormatted}`;
}

function getCastedQuery(field: Field, cast:string): string {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    return `(${jsonFieldPathCompiled})::${cast} AS ${fieldLabelFormatted}`;
}

export default {
    getQuery, getJsonQuery, getCastedQuery
}