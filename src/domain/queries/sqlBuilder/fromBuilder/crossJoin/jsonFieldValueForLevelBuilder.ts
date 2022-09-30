import resourceArrayFields from "../../../../resourceArrayFields";
import FieldPathDecomposed from "../../../fieldPathDecomposed";
import queryStringEscaper from "../../../queryStringEscaper";
import FieldPathForLevelBuilder from "./fieldPathForLevelBuilder";

export default class JsonFieldValueForLevelBuilder {
    pathDecomposed: FieldPathDecomposed;
    fieldPathForLevelBuilder: FieldPathForLevelBuilder;
    builtResourceConnector: boolean;

    constructor(fieldPath: string) {
        const pathEscaped = queryStringEscaper.escape(fieldPath);

        this.pathDecomposed = new FieldPathDecomposed(pathEscaped);
        this.fieldPathForLevelBuilder = new FieldPathForLevelBuilder(fieldPath);
        this.builtResourceConnector = false;
    }

    hasRemainingPathToBuild(): any {
        const remainingPathElementsArray = this.pathDecomposed.toArray();
        const hasRemainingArrays = resourceArrayFields.values.some(af => remainingPathElementsArray.some(pe => pe.path === af));
        return hasRemainingArrays;
    }

    buildPathToNextArray(currentPath: string) {
        let currentPortionOfPath = currentPath;

        while (this.pathDecomposed.length > 0) {
            const currentElement = this.pathDecomposed.next().value;
            const currentPathElement = currentElement.pathElement;

            if (resourceArrayFields.values.some(af => af === currentElement.path)) {
                currentPortionOfPath = `jsonb_array_elements(${currentPortionOfPath}->'${currentPathElement}')`;
                break;
            }

            currentPortionOfPath += `->'${currentPathElement}'`;
        }

        return currentPortionOfPath;
    }

    buildCurrentLevel() {
        if (!this.builtResourceConnector) {
            this.builtResourceConnector = true;
            return this.buildPathToNextArray('resource');
        }

        // stay one level before in field path for current level of json field value.
        const fieldPathFormattedForLevel = this.fieldPathForLevelBuilder.buildCurrentLevel();
        return this.buildPathToNextArray(fieldPathFormattedForLevel);
    }
}
