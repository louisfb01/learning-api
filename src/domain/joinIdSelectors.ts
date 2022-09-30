import Selector from "../models/request/selector";
import queryStringEscaper from "./queries/queryStringEscaper";

type idDataForResource = {
    selectInJoinId: string,
    joinCrossJoin?: string,
    joinCrossId?: string,
    fromSelectorTableId: string,
    joinTableId: string
}

// Key: Initial select table _ join table. Ex: patient_observation is a patient query where join is observation
const joinIdData = new Map<string, idDataForResource>();

joinIdData.set("patient_observation", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".id",
    joinTableId: ".subject_id"
})

joinIdData.set("observation_patient", {
    selectInJoinId: "id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".id"
})

joinIdData.set("encounter_location", {
    selectInJoinId: "id",
    joinCrossJoin: "CROSS JOIN LATERAL jsonb_array_elements(",
    joinCrossId: "location",
    fromSelectorTableId: ".resource->'location'->>'id'",
    joinTableId: ".id"
})

joinIdData.set("patient_encounter", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".id",
    joinTableId: ".subject_id"
})

joinIdData.set("encounter_patient", {
    selectInJoinId: "id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".id"
})

joinIdData.set("observation_observation", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
})

joinIdData.set("observation_encounter", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
})

joinIdData.set("encounter_observation", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
})

joinIdData.set("patient_medicationadministration", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".id",
    joinTableId: ".subject_id"
})

joinIdData.set("medicationadministration_patient", {
    selectInJoinId: "id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".id"
})

joinIdData.set("medicationadministration_observation", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
})

joinIdData.set("observation_medicationadministration", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
})

joinIdData.set("medicationadministration_medicationadministration", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
})

joinIdData.set("encounter_medicationadministration", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
})

joinIdData.set("medicationadministration_encounter", {
    selectInJoinId: "resource->'subject'->>'id' AS subject_id",
    fromSelectorTableId: ".resource->'subject'->>'id'",
    joinTableId: ".subject_id"
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