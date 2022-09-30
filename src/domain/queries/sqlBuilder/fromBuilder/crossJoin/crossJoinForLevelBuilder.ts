import Field from "../../../../../models/request/field";
import Selector from "../../../../../models/request/selector";
import CrossJoinFieldLevelBuilder from "./crossJoinFieldLevelBuilder";

export default class CrossJoinForLevelBuilder {
    fieldLevelBuilders: CrossJoinFieldLevelBuilder[];

    constructor(selector: Selector, field?: Field) {
        const uniqueFieldPaths = new Set<string>();

        if (field) {
            uniqueFieldPaths.add(field.path)
        }

        selector.filters.forEach(filter => uniqueFieldPaths.add(filter.path));

        this.fieldLevelBuilders = new Array<CrossJoinFieldLevelBuilder>();
        for (let fieldPath of uniqueFieldPaths) {
            const fieldLevelBuilder = new CrossJoinFieldLevelBuilder(fieldPath);
            this.fieldLevelBuilders.push(fieldLevelBuilder);
        }
    }

    hasRemainingPathToBuild() {
        return this.fieldLevelBuilders.some(flb => flb.hasRemainingPathToBuild());
    }

    buildCurrentLevel() {
        const fieldLevelBuildersForLevel = this.fieldLevelBuilders.filter(flb => flb.hasRemainingPathToBuild());
        const fieldsInCrossJoinDistinct = new Set<string>(fieldLevelBuildersForLevel.map(flb => flb.buildCurrentLevel()));

        const fieldInCrossJoinArray = new Array<string>();
        for (let fieldInCrossJoin of fieldsInCrossJoinDistinct.values()) {
            fieldInCrossJoinArray.push(fieldInCrossJoin);
        }

        return `CROSS JOIN LATERAL ${fieldInCrossJoinArray.join(', ')}`;
    }
}