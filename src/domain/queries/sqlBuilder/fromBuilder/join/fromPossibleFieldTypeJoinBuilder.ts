import FieldInfo from "../../../../../models/fieldInfo";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import joinIdSelectors from "../../../../joinIdSelectors";
import joinFieldTypeInnerQueryBuilder from "./joinFieldTypeInnerQueryBuilder";

function build(selector: Selector, filterTypes: Map<Filter, FieldInfo>) {
    // Example: `JOIN (${innerJoinQuery}) patient ON observation.resource->'subject'->>'id' = patient.id `
    if (!selector.joins) return '';

    const joinSelector = selector.joins;
    const innerQuery = joinFieldTypeInnerQueryBuilder.build(selector, selector.joins, filterTypes);
    const innerTableQueryName = `${joinSelector.resource.toLowerCase()}_table`;

    const joinIdSelector = joinIdSelectors.get(selector, selector.joins);
    const resourceIdRetriever = joinIdSelector?.fromSelectorTableId;
    const joinId = joinIdSelector?.joinTableId;
    const joinCrossJoin = joinIdSelector?.joinCrossJoin ? ` ${joinIdSelector?.joinCrossJoin} ` : '';

    return `JOIN (${innerQuery}) ${innerTableQueryName}${joinCrossJoin} ON ${resourceIdRetriever} = ${joinId}`;
}

export default {
    build
}