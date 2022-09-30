import Selector from "../../../../models/request/selector";
import CrossJoinForLevelBuilder from "./crossJoin/crossJoinForLevelBuilder";

function build(selector: Selector) {
    const crossJoinForLevelBuilder = new CrossJoinForLevelBuilder(selector);
    const crossJoinQueries = new Array<string>();

    while (crossJoinForLevelBuilder.hasRemainingPathToBuild()) {
        const crossJoinQuery = crossJoinForLevelBuilder.buildCurrentLevel();
        crossJoinQueries.push(crossJoinQuery);
    }

    return crossJoinQueries.join(' ');
}

export default {
    build
}