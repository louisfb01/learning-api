import resourceArrayFields from "../resourceArrayFields";
import FieldPathDecomposed from "./fieldPathDecomposed";
import indexArrayFieldDetector from "./fields/indexArrayFieldDetector";
import queryStringEscaper from "./queryStringEscaper";

function getFieldPathCompiled(fieldPathEscaped: string): string {
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = 'resource';


    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        const isArrayPathElement = resourceArrayFields.values.some(v => v === currentPathElement.path);

        if (pathDecomposed.length === 0 && !isArrayPathElement) {
            pathCompiled += `->>'${currentPathElement.pathElement}'`;
        } else {
            pathCompiled += `->'${currentPathElement.pathElement}'`;
        }

        if (isArrayPathElement) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }

    return pathCompiled;
}

function getPathCompiled(path: string, selectorLabel?: string): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const isIndexArrayField = indexArrayFieldDetector.isIndexArrayField(fieldPathEscaped)
    if(isIndexArrayField && selectorLabel){
        return getIndexPathCompiled(path, selectorLabel)
    }
    return getFieldPathCompiled(fieldPathEscaped);
}

function getJsonPathCompiled(path: string): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = 'resource';


    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        const isArrayPathElement = resourceArrayFields.values.some(v => v === currentPathElement.path);

        pathCompiled += `->'${currentPathElement.pathElement}'`;
        
        if (isArrayPathElement) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }

    return pathCompiled;
}

function getIndexPathCompiled(path: string, selectorLabel:string): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = `${selectorLabel}_table.resource`;


    while (pathDecomposed.length > 1) {
        const currentPathElement = pathDecomposed.next().value;
        pathCompiled += `->'${currentPathElement.pathElement}'`;
    }

    return pathCompiled;
}
export default {
    getPathCompiled, getJsonPathCompiled, getIndexPathCompiled
}