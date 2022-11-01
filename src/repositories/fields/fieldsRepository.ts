import fieldLabelFormatter from "../../domain/queries/fieldLabelFormatter";
import getFieldTypesQuery from "../../domain/queries/fields/getFieldTypesQuery";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import PrepareRequestBody from "../../models/request/prepareRequestBody";

const computedFields = new Map<string, string>();

computedFields.set('string', 'TEXT'); //set(jsonb_type, pg_type)
computedFields.set('number', 'FLOAT');
computedFields.set('integer', 'FLOAT');
computedFields.set('double precision', 'FLOAT');
computedFields.set('boolean', 'BOOLEAN');
computedFields.set('dateTime', 'DATE');

async function getFieldInfo(selector: Selector, fieldsAndFieldReponses: Map<Field, FieldInfo | Error>, filterFieldsNoErrors: Map<Filter, FieldInfo>) {
    try {
        if (selector.fields.length > 0) {
            var fieldTypesInSelector:boolean = true;
            selector.fields.filter(field => {
                if(!field.type)
                    fieldTypesInSelector = false
            })

            if(fieldTypesInSelector){
                var selectorFieldTypes:any[] = [];
                selector.fields.forEach(field => {
                    
                    const fieldLabelNormalized = fieldLabelFormatter.formatLabel(field.label);
                    selectorFieldTypes.push({[fieldLabelNormalized] : field.type})
                })

                getFieldReponsesFromData(selector, selectorFieldTypes, fieldsAndFieldReponses);
            }
            else{
                const query = getFieldTypesQuery.getQuery(selector, filterFieldsNoErrors);
                const selectorFieldTypes = await aidboxProxy.executeQuery(query);
                getFieldReponsesFromData(selector, selectorFieldTypes, fieldsAndFieldReponses);
            }
        }

        const joinSelector = selector.joins;
        if (!joinSelector) return;

        await getFieldInfo(joinSelector, fieldsAndFieldReponses, filterFieldsNoErrors);
    }
    catch (error) {
        for (let field of selector.fields) {
            fieldsAndFieldReponses.set(field, error as any);
        }
    }
}

function getFieldReponsesFromData(selector: Selector, data: any[], fieldsAndFieldReponses: Map<Field, FieldInfo | Error>) {

    selector.fields.forEach((field) => {
        if (data instanceof Error) {
            fieldsAndFieldReponses.set(field, data);
            return;
        }

        const fieldLabelNormalized = fieldLabelFormatter.formatLabel(field.label);
        let fieldType = data.map(r => r[fieldLabelNormalized]).filter(v => v != null)[0] as string;
        let compiledFieldType = computedFields.get(fieldType)
        if (!compiledFieldType) {
            compiledFieldType = fieldType;
        }
        const fieldInfo: FieldInfo = {
            name: fieldLabelNormalized,
            type: String(compiledFieldType)
        };
        fieldsAndFieldReponses.set(field, fieldInfo);
    });
    return fieldsAndFieldReponses;
}

async function getFieldsDataFromRequest(prepareRequest: PrepareRequestBody, filterFieldsNoErrors: Map<Filter, FieldInfo>) {
    let fieldsAndFieldReponses = new Map<Field, FieldInfo | Error>();

    for (let selectorIndex = 0; selectorIndex < prepareRequest.selectors.length; selectorIndex++) {
        const selector = prepareRequest.selectors[selectorIndex];
        const data = await getFieldInfo(selector, fieldsAndFieldReponses, filterFieldsNoErrors);
    }

    return fieldsAndFieldReponses;
}

export default {
    getFieldsDataFromRequest
}