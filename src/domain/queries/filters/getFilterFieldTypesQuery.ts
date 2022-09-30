import Selector from "../../../models/request/selector";
import Filter from "../../../models/request/filter";
import FieldInfo from "../../../models/fieldInfo";
import SqlBuilder from "../sqlBuilder/sqlBuilder";

// During this phase field types are unknown since this is the goal of query.
const filterTypes = new Map<Filter, FieldInfo>();

function getQuery(selector: Selector): string {
    return new SqlBuilder()
        .select()
        .distinct()
        .filterTypes()
        .from()
        .resourceTable()
        .build(selector, filterTypes);
}

export default {
    getQuery
}