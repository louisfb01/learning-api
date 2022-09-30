import getFieldTypesQuery from "../../domain/queries/fields/getFieldTypesQuery";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import fieldLabelFormatter from "../../domain/queries/fieldLabelFormatter";

const computedFields = new Map<string, string>();

computedFields.set('string', 'TEXT'); //set(jsonb_type, pg_type)
computedFields.set('number', 'FLOAT');
computedFields.set('boolean', 'BOOLEAN');

async function getFieldInfo(selector: Selector, filterFieldsNoErrors: Map<Filter, FieldInfo>) {
    const query = getFieldTypesQuery.getQuery(selector, filterFieldsNoErrors);
    const selectorFieldTypes = await aidboxProxy.executeQuery(query);
    return selectorFieldTypes;
}

function getFieldReponsesFromData(selector: Selector, data: any[], fieldsAndFieldReponses: Map<Field, FieldInfo | Error>) {

    selector.fields.forEach((field) => {
        if (data instanceof Error) {
            fieldsAndFieldReponses.set(field, data);
            return;
        }

        const fieldLabelNormalized = fieldLabelFormatter.formatLabel(field.label);
        let fieldType = computedFields.has(field.label)
            ? computedFields.get(field.label)
            : data.map(r => r[fieldLabelNormalized]).filter(v => v != null)[0] as string;
        if (fieldType) {
            fieldType = computedFields.has(fieldType) ? computedFields.get(fieldType) : fieldType;
        }
        const fieldInfo: FieldInfo = {
            name: fieldLabelNormalized,
            type: String(fieldType)
        };

        fieldsAndFieldReponses.set(field, fieldInfo);
    });
    return fieldsAndFieldReponses;
}

async function getFieldsDataFromRequest(selector: Selector, filterFieldsNoErrors: Map<Filter, FieldInfo>) {
    let fieldsAndFieldReponses = new Map<Field, FieldInfo | Error>();

    const data = await getFieldInfo(selector, filterFieldsNoErrors);


    fieldsAndFieldReponses = getFieldReponsesFromData(selector, data, fieldsAndFieldReponses);

    fieldsAndFieldReponses = getAllJoinFieldsData(selector, data, fieldsAndFieldReponses);
    return fieldsAndFieldReponses;
}

function getAllJoinFieldsData(selector: Selector, data: any[], fieldsAndFieldReponses: Map<Field, FieldInfo | Error>): any {
    if (!selector.joins) {
        return fieldsAndFieldReponses;
    }
    else {
        fieldsAndFieldReponses = getFieldReponsesFromData(selector.joins, data, fieldsAndFieldReponses);
        return getAllJoinFieldsData(selector.joins, data, fieldsAndFieldReponses);
    }
}

export default {
    getFieldsDataFromRequest
}