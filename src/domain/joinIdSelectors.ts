import Selector from "../models/request/selector";
import queryStringEscaper from "./queries/queryStringEscaper";

type idDataForResource = {
    selectInJoinId: string,
    joinCrossJoin?: string,
    fromSelectorTableId: string,
    joinTableId: string
}

// Key: Initial select table _ join table. Ex: patien_observation is a patient query where join is observation
const joinIdData = new Map<string, idDataForResource>();

joinIdData.set("patient_observation", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: "patient_table.id",
    joinTableId: "observation_table.subject_id"
})

joinIdData.set("observation_patient", {
    selectInJoinId: "id",
    fromSelectorTableId: "observation_table.resource->'subject'->>'id'",
    joinTableId: "patient_table.id"
})

joinIdData.set("encounter_location", {
    selectInJoinId: "id",
    joinCrossJoin: "CROSS JOIN LATERAL jsonb_array_elements(encounter_table.resource -> 'location') AS location_location",
    fromSelectorTableId: "location_location->'location'->>'id'",
    joinTableId: "location_table.id"
})

joinIdData.set("patient_encounter", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: "patient_table.id",
    joinTableId: "encounter_table.subject_id"
})

joinIdData.set("encounter_patient", {
    selectInJoinId: "id",
    fromSelectorTableId: "encounter_table.resource->'subject'->>'id'",
    joinTableId: "patient_table.id"
})

function get(selector: Selector, joinSelector: Selector) {
    const selectorResource = queryStringEscaper.escape(selector.resource.toLowerCase());
    const joinResource = queryStringEscaper.escape(joinSelector.resource.toLowerCase());

    const key = `${selectorResource}_${joinResource}`;
    return joinIdData.get(key);
}

export default {
    get
}