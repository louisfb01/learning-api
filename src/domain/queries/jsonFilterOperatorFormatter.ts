import Filter from "../../models/request/filter";

function formatOperatorForSql(filter: Filter) {
    const filterOperator = filter.operator.replace(/_/g, '').toLowerCase();

    if (['is', 'equals', 'on'].some(op => op === filterOperator)) {
        return '=';
    }

    if (['not', 'isnot', 'notequals', 'noton'].some(op => op === filterOperator)) {
        return '!=';
    }

    if (['after', 'morethan'].some(op => op === filterOperator)) {
        return '>';
    }

    if (['afteroron', 'moreorequalthan'].some(op => op === filterOperator)) {
        return '>=';
    }

    if (['before', 'lessthan'].some(op => op === filterOperator)) {
        return '<';
    }

    if (['beforeoron', 'lessorequalthan'].some(op => op === filterOperator)) {
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