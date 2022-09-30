import Selector from "../../../../models/request/selector";
import getFieldSelectQuery from "../../fields/getFieldSelectQuery";
import fieldLabelFormatter from "../../fieldLabelFormatter";

function build(selector: Selector) {
    let selectorFields = selector.fields
        .map(field => getFieldSelectQuery.getQuery(field))
    selectorFields = selectorFields.concat(getAllJoinFields(selector) as string[])
    return selectorFields.join(", ")
}

function getAllJoinFields(selector: Selector) : String[]{//get all fields from nested joins
    if(!selector.joins){//base case
        return [];
    }
    else{//recursive step
       return selector.joins.fields
        .map(f => fieldLabelFormatter.formatLabel(f.label))
        .concat(getAllJoinFields(selector.joins) as string[])
    }
}
export default {
    build
}