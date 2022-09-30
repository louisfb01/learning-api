import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import CrossJoinForLevelBuilder from "./crossJoin/crossJoinForLevelBuilder";

function build(selector: Selector, field?: Field) {
    const crossJoinForLevelBuilder = new CrossJoinForLevelBuilder(selector, field);
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