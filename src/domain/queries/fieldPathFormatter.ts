import queryStringEscaper from "./queryStringEscaper";

function formatPath(fieldPath: string) {
    const pathEscaped = queryStringEscaper.escape(fieldPath);
    return pathEscaped.toLowerCase().replace(/\./g, '_');
}

export default {
    formatPath
}