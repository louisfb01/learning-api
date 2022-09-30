import Field from "../../../../models/request/field";
import calculatedFields from "../../../calculatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field) {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    return `${jsonFieldPathCompiled} AS ${fieldLabelFormatted}`;
}

export default {
    build
}