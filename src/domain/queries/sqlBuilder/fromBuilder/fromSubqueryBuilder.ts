import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import fieldPathFormatter from "../../fieldPathFormatter";
import jsonFieldValuePathCompiler from "../../../queries/jsonFieldValuePathCompiler";

function getFieldPathNormalised(fieldPath: string) {
    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);
    const fieldPathNormalized = fieldPathFormatter.formatPath(fieldPath)

    return `${jsonFieldPathCompiled} AS ${fieldPathNormalized}`;
}

function build(selector: Selector, field: Field, subqueryName: string) {
    const fieldPathNormalizedDistinct = new Set<string>();
    fieldPathNormalizedDistinct.add(getFieldPathNormalised(field.path));

    selector.filters.filter(f => f.path != field.path).forEach(filter => {
        const filterPathNormalized = getFieldPathNormalised(filter.path);
        fieldPathNormalizedDistinct.add(filterPathNormalized);
    })

    const fieldPathNormalized = new Array<string>();
    const pathNormalized = fieldPathNormalizedDistinct.values();

    for (let pathNormalizedIndex = 0; pathNormalizedIndex < fieldPathNormalizedDistinct.size; pathNormalizedIndex++) {
        fieldPathNormalized.push(pathNormalized.next().value);
    }

    return `(SELECT ${fieldPathNormalized.join(', ')} FROM ${selector.label}) AS ${subqueryName}`;
}

export default {
    build
}