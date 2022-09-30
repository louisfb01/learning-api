import FieldPathForLevelBuilder from "./fieldPathForLevelBuilder";
import JsonFieldValueForLevelBuilder from "./jsonFieldValueForLevelBuilder";

export default class CrossJoinFieldLevelBuilder {
    jsonFieldValueForLevelBuilder: JsonFieldValueForLevelBuilder;
    fieldPathForLevelBuilder: FieldPathForLevelBuilder;

    constructor(fieldPath: string) {
        this.jsonFieldValueForLevelBuilder = new JsonFieldValueForLevelBuilder(fieldPath);
        this.fieldPathForLevelBuilder = new FieldPathForLevelBuilder(fieldPath);
    }

    hasRemainingPathToBuild() {
        return this.jsonFieldValueForLevelBuilder.hasRemainingPathToBuild();
    }

    buildCurrentLevel() {
        const jsonFieldValue = this.jsonFieldValueForLevelBuilder.buildCurrentLevel();
        const fieldPathFormatted = this.fieldPathForLevelBuilder.buildCurrentLevel();

        return `${jsonFieldValue} AS ${fieldPathFormatted}`;
    }

}