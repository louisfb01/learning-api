import fieldPathFormatter from "../fieldPathFormatter";
import jsonTypePathCompiler from "../../queries/jsonTypePathCompiler";


function getQuery(filterPath: string): string {
    const jsonTypePathCompiled = jsonTypePathCompiler.getPathCompiled(filterPath);
    const fieldPathFormatted = fieldPathFormatter.formatPath(filterPath);

    return `${jsonTypePathCompiled} AS ${fieldPathFormatted}`;
}

export default {
    getQuery
}

