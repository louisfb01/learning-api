import Selector from "../../../../models/request/selector";
import getFieldTypeSelectQuery from "../../fields/getFieldTypeSelectQuery";
import fieldLabelFormatter from "../../fieldLabelFormatter";

function build(selector: Selector) {
    let selectorFieldTypes = selector.fields
        .map(field => getFieldTypeSelectQuery.getQuery(field))
        selectorFieldTypes = selectorFieldTypes.concat(getAllJoinFields(selector) as string[])
        return selectorFieldTypes.join(", ")
}

function getAllJoinFields(selector: Selector) : String[]{//get all fields from nested joins
        if(!selector.joins){//base case
            return [];
        }
        else{//recursive step
           return selector.joins.fields
            .map(f => getFieldTypeSelectQuery.getQueryfromLabel(f))
            .concat(getAllJoinFields(selector.joins) as string[])
        }
    }

export default {
    build
}