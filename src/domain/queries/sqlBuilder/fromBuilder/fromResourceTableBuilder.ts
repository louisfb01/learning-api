import Selector from "../../../../models/request/selector";
import queryStringEscaper from "../../../queries/queryStringEscaper";

function build(selector: Selector) {
    const tableLabelSqlSafe = queryStringEscaper.escape(selector.label)
    const tableNameSqlSafe = queryStringEscaper.escape(selector.resource)
    return `${tableNameSqlSafe} ${tableLabelSqlSafe.toLowerCase()}_table`;
}

export default {
    build
}