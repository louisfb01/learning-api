import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import commaBuilder from "../commaBuilder";
import FromSqlBuilder from "../fromBuilder/fromSqlBuilder";
import SqlBuilder from "../sqlBuilder";
import selectBuilder from "./selectBuilder";
import selectCountAllBuilder from "./selectCountAllBuilder";
import selectCountSubqueryFieldBuilder from "./selectCountSubqueryFieldBuilder";
import selectDistinctBuilder from "./selectDistinctBuilder";
import selectFieldBuilder from "./selectFieldBuilder";
import selectFieldTypesBuilder from "./selectFieldTypesBuilder";
import selectFilterTypesBuilder from "./selectFilterTypesBuilder";
import selectJoinIdBuilder from "./selectJoinIdBuilder";
import selectNamedCountAllBuilder from "./selectNamedCountAllBuilder";
import selectSubqueryFieldBuilder from "./selectSubqueryFieldBuilder";
import selectResourceBuilder from "./selectResourceBuilder";
import selectFieldsBuilder from "./selectFieldsBuilder";
import selectFieldsJsonBuilder from "./selectFieldsJsonBuilder";
import selectCastedFieldsBuilder from "./selectCastedFieldsBuilder";

export default class SelectSqlBuilder {
    sqlBuilder: SqlBuilder;

    constructor(sqlBuilder: SqlBuilder) {
        this.sqlBuilder = sqlBuilder;

        this.sqlBuilder.requestBuilders.push(selectBuilder.build);
    }

    distinct() {
        this.sqlBuilder.requestBuilders.push(selectDistinctBuilder.build);
        return this;
    }

    joinId(parentSelector: Selector) {
        const builderFunction = (selector: Selector) => selectJoinIdBuilder.build(parentSelector, selector);

        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }

    fieldTypes() {
        this.sqlBuilder.requestBuilders.push(selectFieldTypesBuilder.build);
        return this;
    }
    
    fields() {
        this.sqlBuilder.requestBuilders.push(selectFieldsBuilder.build);
        return this;
    }

    fieldsJson() {
        this.sqlBuilder.requestBuilders.push(selectFieldsJsonBuilder.build);
        return this;
    }

    castedFields(selector: Selector, fieldTypes: Map<Field, FieldInfo>) {
        const builderFunction = () => selectCastedFieldsBuilder.build(selector, fieldTypes);
        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }

    filterTypes() {
        this.sqlBuilder.requestBuilders.push(selectFilterTypesBuilder.build);
        return this;
    }

    countAll() {
        this.sqlBuilder.requestBuilders.push(selectCountAllBuilder.build);
        return this;
    }
    field(field: Field) {
        const builderFunction = () => selectFieldBuilder.build(field);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }
    subqueryField(field: Field, subqueryName: string) {
        const builderFunction = () => selectSubqueryFieldBuilder.build(field, subqueryName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    countSubqueryField(field: Field, subqueryName: string) {
        const builderFunction = () => selectCountSubqueryFieldBuilder.build(field, subqueryName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    namedCountAll(countName: string) {
        const builderFunction = () => selectNamedCountAllBuilder.build(countName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    comma() {
        this.sqlBuilder.requestBuilders.push(commaBuilder.build);
        return this;
    }

    from() {
        const fromSqlBuilder = new FromSqlBuilder(this.sqlBuilder);
        return fromSqlBuilder;
    }

    resource(){
        this.sqlBuilder.requestBuilders.push(selectResourceBuilder.build);
        return this;
    }

    build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) {
        return this.sqlBuilder.build(selector, filterFieldTypes);
    }
}