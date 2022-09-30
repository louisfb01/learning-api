import fieldPathFormatter from "../../domain/queries/fieldPathFormatter";
import getFilterFieldTypesQuery from "../../domain/queries/filters/getFilterFieldTypesQuery";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import PrepareRequestBody from "../../models/request/prepareRequestBody";

function setFilterFieldTypes(filters: Filter[], response: any[], fieldsAndFieldReponses: Map<Filter, FieldInfo | Error>) {
    for (let filter of filters) {
        const fieldPathNormalized = fieldPathFormatter.formatPath(filter.path);
        const fieldType = response.map(r => r[fieldPathNormalized]).filter(v => v != null);

        const fieldInfo: FieldInfo = {
            name: filter.path,
            type: String(fieldType)
        };

        fieldsAndFieldReponses.set(filter, fieldInfo);
    }
}

async function getSelectorFieldInfos(selector: Selector, filterType: Map<Filter, FieldInfo | Error>) {
    try {
        if (selector.filters.length > 0) {

            const query = getFilterFieldTypesQuery.getQuery(selector);
            const selectorFieldTypes = await aidboxProxy.executeQuery(query);

            setFilterFieldTypes(selector.filters, selectorFieldTypes, filterType);
        }

        const joinSelector = selector.joins;
        if (!joinSelector) return;

        await getSelectorFieldInfos(joinSelector, filterType);
    }
    catch (error:any) {
        for (let filter of selector.filters) {
            filterType.set(filter, error);
        }
    }
}

async function getFieldsDataFromRequest(prepareRequest: PrepareRequestBody): Promise<Map<Filter, FieldInfo | Error>> {
    const fieldsAndFieldReponses = new Map<Filter, FieldInfo | Error>();

    for (let selectorIndex = 0; selectorIndex < prepareRequest.selectors.length; selectorIndex++) {
        const selector = prepareRequest.selectors[selectorIndex];
        await getSelectorFieldInfos(selector, fieldsAndFieldReponses);
    }

    return fieldsAndFieldReponses;
}

export default {
    getFieldsDataFromRequest
}