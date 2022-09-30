import resourceArrayFields from "../../../resourceArrayFields";
import FieldPathDecomposed from "../../fieldPathDecomposed";
import arrayFieldDetector from "../../fields/arrayFieldDetector";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";
import { pathAndPathElement } from "../../pathAndPathElement";
import queryStringEscaper from "../../queryStringEscaper";

export default class WhereJsonArrayFormatterBuilder {
    pathEscaped: string;
    pathDecomposed: FieldPathDecomposed;

    constructor(fieldPath: string) {
        this.pathEscaped = queryStringEscaper.escape(fieldPath);
        this.pathDecomposed = new FieldPathDecomposed(this.pathEscaped);
    }

    getElementsToLastArray() {
        let elementsToNextArray = new Array<pathAndPathElement>();
        const potentialElementsToNextArray = new Array<pathAndPathElement>();

        const pathAndPathElements = this.pathDecomposed.toArray();

        for (let elementIndex = 0; elementIndex < pathAndPathElements.length; elementIndex++) {
            const pathElement = pathAndPathElements[elementIndex];
            potentialElementsToNextArray.push(pathElement);

            if (resourceArrayFields.values.some(af => af === pathElement.path)) {
                elementsToNextArray = new Array(...potentialElementsToNextArray);
            }
        }

        return elementsToNextArray;
    }

    getPathFromElements() {
        let pathFromElements = '';

        for (let pathElement of this.pathDecomposed) {

            if (this.pathDecomposed.length === 0) {
                pathFromElements += `->>'${pathElement.pathElement}'`;
                continue;
            }

            pathFromElements += `->'${pathElement.pathElement}'`;
        }

        return pathFromElements;
    }

    build() {
        let jsonPath = '';

        const isArrayField = arrayFieldDetector.isArrayField(this.pathEscaped);
        if (!isArrayField) {
            return jsonFieldValuePathCompiler.getPathCompiled(this.pathEscaped);
        }

        const elementsUntilArray = this.getElementsToLastArray();
        jsonPath = elementsUntilArray.map(eua => eua.pathElement).join('_').toLowerCase();
        for (let pathElement of elementsUntilArray) {
            this.pathDecomposed.next(); // Clear elements that are considered to be used in array portion.
        }

        jsonPath += this.getPathFromElements();

        return jsonPath;
    }
}