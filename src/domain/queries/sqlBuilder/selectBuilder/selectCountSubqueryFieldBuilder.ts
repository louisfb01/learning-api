import Field from "../../../../models/request/field";
import fieldPathFormatter from "../../fieldPathFormatter";

function build(field: Field, subqueryName: string) {
    const fieldPathNormalized = fieldPathFormatter.formatPath(field.path);

    return `count(${subqueryName}.${fieldPathNormalized})`;
}

export default {
    build
}