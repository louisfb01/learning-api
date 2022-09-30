const calculatedFields = new Map<string, string>();

calculatedFields.set("age", "CASE WHEN resource->'deceased'->>'dateTime' IS NULL THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) END")
calculatedFields.set("isDeceased", "resource->'deceased'->>'dateTime' IS NOT NULL OR resource->'deceased'->>'boolean' IS NOT NULL")
export default {
    calculatedFields
}