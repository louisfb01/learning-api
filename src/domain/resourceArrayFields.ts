const values = [
    /* Patient */
    "name",
    "name.given",
    "address",
    "link",

    /* Observation */
    "code.coding",
    "link",
    "interpretation",
    "interpretation.coding",
    "bodySite.coding",
    "value.CodeableConcept.coding",

    /* Encounter */
    "location",
    "reasonCode",

    /* Location */
    "type",
    "type.coding",
    "physicalType.coding",
    "identifier",

    /*medicationAdministration */
    "medication.CodeableConcept.coding",
    "contained.code.coding",

]

export default {
    values
}