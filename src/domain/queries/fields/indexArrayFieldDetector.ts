import resourceIndexArrayFields from "../../resourceIndexArrayFields";
import FieldPathDecomposed from "../fieldPathDecomposed";

function isIndexArrayField(fieldPath: string) {
    const pathDecomposed = new FieldPathDecomposed(fieldPath);

    for (let pathElement of pathDecomposed) {
        if (resourceIndexArrayFields.values.some(raf => raf === pathElement.path))
            return true;
    }

    return false;
}

export default {
    isIndexArrayField
}