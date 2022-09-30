import Selector from "../../../../models/request/selector";
import queryStringEscaper from "../../../queries/queryStringEscaper";

function build(selector: Selector) {
    const tableNameSqlSafe = queryStringEscaper.escape(selector.resource)
    return `${tableNameSqlSafe} ${tableNameSqlSafe.toLowerCase()}_table`;
}

export default {
    build
}