import Selector from "../../models/request/selector";

type queryAndResult = { query: string, result: any };
export default class QueryDataResults {
    selectorResults: Map<Selector, queryAndResult>;
    constructor() {
        this.selectorResults = new Map<Selector, queryAndResult>();
    }

    addSelectorResult(selector: Selector, result: queryAndResult) {
        this.selectorResults.set(selector, result);
    }

    getSelectorResult(selector: Selector) {
        const result = this.selectorResults.get(selector);
        if (!result) throw new Error('No result for this selector');

        return result;
    }
}