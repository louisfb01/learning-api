
import resourceQuery from "../../domain/queries/ResourceQuery";
import QueryDataResults from "../../domain/queries/queryDataResults";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import Field from "../../models/request/field";

async function executeQueries(queryDataResults: QueryDataResults,
    selector: Selector,
    filterTypes: Map<Filter, FieldInfo>,
    fieldTypes: Map<Field, FieldInfo>): Promise<void> {

    const query = resourceQuery.getQuery(selector, filterTypes, fieldTypes);

    const result = await aidboxProxy.executeQuery(query) as any[];
    queryDataResults.addSelectorResult(selector, { query: query, result: result });

    }

export default {
    executeQueries
}