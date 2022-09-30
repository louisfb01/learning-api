import QueryDataResults from "../../queries/queryDataResults";
import PrepareRequestBody from "../../../models/request/prepareRequestBody";
import PrepareResponse from "../../../models/response/prepareResponse";
import prepareResponseProcessor from "./prepareResponseProcessor";
import Field from "../../../models/request/field";
import FieldInfo from "../../../models/fieldInfo";

async function getPrepareResponses(prepareRequest: PrepareRequestBody, 
    queryDataResults: QueryDataResults,
    fieldTypes: Map<Field, FieldInfo>): Promise<PrepareResponse[]>  {

    const prepareReponses = new Array<PrepareResponse>();

    for (let reponseIndex = 0; reponseIndex < prepareRequest.selectors.length; reponseIndex++) {
        const selector = prepareRequest.selectors[reponseIndex];
        const options = prepareRequest.options;
        const jobID = prepareRequest.job;

        const prepareReponse = await prepareResponseProcessor.getPrepareResponse(selector, options, queryDataResults, jobID, fieldTypes);
        prepareReponses.push(prepareReponse);
    }

    return prepareReponses;
}

export default {
    getPrepareResponses
}