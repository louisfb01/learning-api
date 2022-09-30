import Selector from "../../../../models/request/selector";
import getFilterTypeSelectQuery from "../../fields/getFilterTypeSelectQuery";

function build(selector: Selector) {
    return selector.filters
        .map(f => getFilterTypeSelectQuery.getQuery(f.path))
        .join(', ');;
}

export default {
    build
}