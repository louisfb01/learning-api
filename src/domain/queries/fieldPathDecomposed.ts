import { Queue } from "queue-typescript"
import { pathAndPathElement } from "./pathAndPathElement";

export default class FieldPathDecomposed implements IterableIterator<pathAndPathElement> {
    pathAndPathElements: Queue<pathAndPathElement>;
    get length() {
        return this.pathAndPathElements.length;
    }

    constructor(fieldPath: string) {
        const fieldPathElements = fieldPath.split('.');
        const currentPathElements = new Array<string>();

        this.pathAndPathElements = new Queue<pathAndPathElement>();

        for (let pathElement of fieldPathElements) {
            currentPathElements.push(pathElement);

            const pathAndPathElement = {
                path: currentPathElements.join('.'),
                pathElement
            }

            this.pathAndPathElements.append(pathAndPathElement);
        }
    }

    next() {
        const currentItemCount = this.pathAndPathElements.length;

        return { value: this.pathAndPathElements.dequeue(), done: currentItemCount === 0 }
    }

    [Symbol.iterator]() {
        return this;
    }

    toArray() {
        return this.pathAndPathElements.toArray();
    }
}