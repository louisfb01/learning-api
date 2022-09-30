import queryStringEscaper from "./queryStringEscaper";

function formatLabel(fieldLabel: string) {
    const pathEscaped = queryStringEscaper.escape(fieldLabel);
    return pathEscaped.toLowerCase().replace(/[ .]/g, '_');
}

export default {
    formatLabel
}