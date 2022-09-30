import resourceArrayFields from "../../resourceArrayFields";
import FieldPathDecomposed from "../fieldPathDecomposed";

function isArrayField(fieldPath: string) {
    const pathDecomposed = new FieldPathDecomposed(fieldPath);

    for (let pathElement of pathDecomposed) {
        if (resourceArrayFields.values.some(raf => raf === pathElement.path))
            return true;
    }

    return false;
}

export default {
    isArrayField
}