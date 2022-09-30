const possibleComputedFilters = new Map<string, string>();

possibleComputedFilters.set("age", "resource->>'birthDate' != 'null'");

export default {
    possibleComputedFilters
}