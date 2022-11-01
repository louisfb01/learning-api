import FieldInfo from "../../../../../models/fieldInfo";
import Field from "../../../../../models/request/field";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import joinIdSelectors from "../../../../joinIdSelectors";
import queryStringEscaper from "../../../queryStringEscaper";
import joinInnerQueryBuilder from "./joinInnerQueryBuilder";

function build(selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>) {
    // Example: `JOIN (${innerJoinQuery}) patient ON observation.resource->'subject'->>'id' = patient.id `
    if (!selector.joins) return '';

    const joinSelector = selector.joins;
    const innerQuery = joinInnerQueryBuilder.build(selector.joins, filterTypes, fieldTypes);
    const innerTableQueryName = `${joinSelector.label.toLowerCase()}_table`;
    const outerTableQueryName = `${selector.label.toLowerCase()}_table`;
    const selectorResource = queryStringEscaper.escape(selector.resource.toLowerCase());
    const joinResource = queryStringEscaper.escape(joinSelector.resource.toLowerCase());
    var innerId:any, outerId:any;
    if(selectorResource == "encounter" && joinResource == "location"){//only encounter->join->location use different keys to join
        innerId = outerId = joinIdSelectors.get(selector, selector.joins);
    }

    else{   
        outerId = joinIdSelectors.get(selector)
        innerId = joinIdSelectors.get(selector.joins)
    }

    const resourceIdRetriever = outerId?.fromSelectorTableId;
    const joinId = innerId?.joinTableId;
    const joinCrossJoin = innerId?.joinCrossJoin ? ` ${innerId?.joinCrossJoin}${outerTableQueryName}.resource -> '${innerId?.joinCrossId}') AS ${outerTableQueryName}_${innerTableQueryName} ` : '';
    const joinBuilder = innerId?.joinCrossJoin ? 
    `JOIN (${innerQuery}) ${innerTableQueryName}${joinCrossJoin} ON ${outerTableQueryName}_${innerTableQueryName}${resourceIdRetriever} = ${innerTableQueryName}${joinId}` : 
    `JOIN (${innerQuery}) ${innerTableQueryName}${joinCrossJoin} ON ${outerTableQueryName}${resourceIdRetriever} = ${innerTableQueryName}${joinId}`;
    return joinBuilder
}

export default {
    build
}