import resourceArrayFields from "../resourceArrayFields";
import FieldPathDecomposed from "./fieldPathDecomposed";
import queryStringEscaper from "./queryStringEscaper";
import calculatedFields from "../calculatedFields";

function getFieldPathCompiled(fieldPathEscaped: string): string {
    const calculatedField = calculatedFields.calculatedFields.get(fieldPathEscaped);
    if (calculatedField) {
        return `pg_typeof(${calculatedField})`;
    }

    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);
    let pathCompiled = 'resource';

    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        pathCompiled += `->'${currentPathElement.pathElement}'`;

        if (resourceArrayFields.values.some(v => v === currentPathElement.path)) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }

    return `jsonb_typeof(${pathCompiled})`;
}

function getPathCompiled(fieldPath: string): string {
    const fieldPathEscaped = queryStringEscaper.escape(fieldPath);

    return getFieldPathCompiled(fieldPathEscaped);
}

export default {
    getPathCompiled
}