import { Queue } from "queue-typescript";
import resourceArrayFields from "../resourceArrayFields";
import FieldPathDecomposed from "./fieldPathDecomposed";
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

function getPathCompiled(path: string): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);

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

export default {
    getPathCompiled, getJsonPathCompiled
}