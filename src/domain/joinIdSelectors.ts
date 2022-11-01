import Selector from "../models/request/selector";
import queryStringEscaper from "./queries/queryStringEscaper";

type idDataForResource = {
    selectInJoinId: string, //join selector
    joinCrossJoin?: string,
    joinCrossId?: string,
    fromSelectorTableId: string, //parent selector
    joinTableId: string //join selector
}

// Key: Initial select table _ join table. Ex: patient_observation is a patient query where join is observation
const joinIdData = new Map<string, idDataForResource>();

joinIdData.set("observation", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    joinTableId: ".subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
})

joinIdData.set("patient", {
    selectInJoinId: "id",
    joinTableId: ".id",
    fromSelectorTableId: ".id",
})

joinIdData.set("encounter", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    joinTableId: ".subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
})

joinIdData.set("medicationadministration", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    joinTableId: ".subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
})

joinIdData.set("imagingstudy", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    joinTableId: ".subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
})

joinIdData.set("encounter_location", {
    selectInJoinId: "id",
    joinCrossJoin: "CROSS JOIN LATERAL jsonb_array_elements(",
    joinCrossId: "location",
    fromSelectorTableId: "->'location'->>'id'",
    joinTableId: ".id"
})

function get(selector: Selector, joinSelector?: Selector) {
    const selectorResource = queryStringEscaper.escape(selector.resource.toLowerCase());
    if(joinSelector){
        const joinResource = queryStringEscaper.escape(joinSelector.resource.toLowerCase());
        const key = `${selectorResource}_${joinResource}`;
        return joinIdData.get(key);
    }
    const key = `${selectorResource}`;
    return joinIdData.get(key);
}

export default {
    get
}