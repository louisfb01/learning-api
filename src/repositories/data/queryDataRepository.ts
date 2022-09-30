import QueryDataResults from "../../domain/queries/queryDataResults";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import PrepareRequestBody from "../../models/request/prepareRequestBody";
import selectorsDataQueryExecutor from "./selectorsDataQueryExecutor";

async function executeQueries(prepareRequest: PrepareRequestBody,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>): Promise<QueryDataResults> {

    const queryDataResults = new QueryDataResults();

    // Use for instead of forEach for promise syncing
    for (let selectorIndex = 0; selectorIndex < prepareRequest.selectors.length; selectorIndex++) {
        const selector = prepareRequest.selectors[selectorIndex];
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, filterTypes, fieldTypes);
    }

    return queryDataResults;
}

export default {
    executeQueries
}