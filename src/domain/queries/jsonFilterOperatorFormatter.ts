import Filter from "../../models/request/filter";

function formatOperatorForSql(filter: Filter) {
    const filterOperator = filter.operator.replace(/_/g, '').toLowerCase();
    const value = String(filter.value)
    if (['is', 'equals', 'on', 'equal'].some(op => op === filterOperator)) {
        if(value.toLowerCase() === 'null') {
            return 'is';
        }

        return '=';
    }

    if (['not', 'isnot', 'notequals', 'noton', 'not_equal', 'notequal'].some(op => op === filterOperator)) {
        if(value.toLowerCase() === 'null') {
            return 'is not';
        }

        return '!=';
    }

    if (['after', 'morethan', 'greater'].some(op => op === filterOperator)) {
        return '>';
    }

    if (['afteroron', 'moreorequalthan', 'greater_or_equal', 'greaterorequal'].some(op => op === filterOperator)) {
        return '>=';
    }

    if (['before', 'lessthan', 'less'].some(op => op === filterOperator)) {
        return '<';
    }

    if (['beforeoron', 'lessorequalthan', 'less_or_equal', 'lessorequal'].some(op => op === filterOperator)) {
        return '<=';
    }

    if (['matches', 'like'].some(op => op === filterOperator)) {
        return 'LIKE';
    }

    throw new Error(`${filterOperator} is not supported`);
}

export default {
    formatOperatorForSql
}