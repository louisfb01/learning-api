const calculatedFields = new Map<string, string>();

calculatedFields.set("age", "CASE WHEN resource->'deceased'->>'dateTime' IS NULL OR resource->'deceased'->>'dateTime' = 'NaT' THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END")
calculatedFields.set("isDeceased", "resource->'deceased'->>'dateTime' IS NOT NULL AND resource->'deceased'->>'dateTime' != 'NaT' OR resource->'deceased'->>'boolean' IS NOT NULL")
export default {
    calculatedFields
}