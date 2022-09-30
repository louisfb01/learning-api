import Selector from "../../../../models/request/selector";

function build(selector: Selector) {
    if (!selector.limit) return '';
    const limit = selector.limit
    return `LIMIT ${limit}`;
}

export default {
    build
}