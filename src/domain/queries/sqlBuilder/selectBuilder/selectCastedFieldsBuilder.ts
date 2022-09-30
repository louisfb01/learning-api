import Selector from "../../../../models/request/selector";
import getFieldSelectQuery from "../../fields/getFieldSelectQuery";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import Field from "../../../../models/request/field";
import FieldInfo from "../../../../models/fieldInfo";

function build(selector: Selector, fieldTypes: Map<Field, FieldInfo>) {
    let selectorFields = selector.fields
        .map(field => getCastedField(field, fieldTypes))
    selectorFields = selectorFields.concat(getAllJoinFields(selector, fieldTypes) as string[])
    return selectorFields.join(", ")
}

function getAllJoinFields(selector: Selector, fieldTypes: Map<Field, FieldInfo>) : String[]{//get all fields from nested joins
    if(!selector.joins){//base case
        return [];
    }
    else{//recursive step
       return selector.joins.fields
        .map(f => getCastedJoinField(f, fieldTypes))
        .concat(getAllJoinFields(selector.joins, fieldTypes) as string[])
    }
}

function getCastedField(field: Field, fieldTypes: Map<Field, FieldInfo>): string{
    const cast = fieldTypes.get(field)?.type;
    const fieldSelect = cast ? getFieldSelectQuery.getCastedQuery(field, cast): getFieldSelectQuery.getQuery(field);
    return fieldSelect;
}

function getCastedJoinField(field: Field, fieldTypes: Map<Field, FieldInfo>): string{
    const fieldSelect = fieldLabelFormatter.formatLabel(field.label);
    const cast = fieldTypes.get(field)?.type;
    return `(${fieldSelect})::${cast}`;
}

export default {
    build
}