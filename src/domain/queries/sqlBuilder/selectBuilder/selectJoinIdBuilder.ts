import Selector from "../../../../models/request/selector";
import joinIdSelectors from "../../../joinIdSelectors";

function build(joinSelector: Selector) {
    const joinIdSelector = joinIdSelectors.get(joinSelector);
    return joinIdSelector?.selectInJoinId ?? '';
}

export default {
    build
}