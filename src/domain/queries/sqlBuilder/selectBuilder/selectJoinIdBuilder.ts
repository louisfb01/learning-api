import Selector from "../../../../models/request/selector";
import joinIdSelectors from "../../../joinIdSelectors";
import queryStringEscaper from "../../queryStringEscaper";

function build(selector: Selector, joinSelector: Selector) {
    const joinIdSelector = joinIdSelectors.get(selector, joinSelector);
    return joinIdSelector?.selectInJoinId ?? '';
}

export default {
    build
}