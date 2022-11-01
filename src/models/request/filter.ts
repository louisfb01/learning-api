export default interface Filter {
    path: string;
    operator: string;
    value: string | boolean | number;
    type: string;
}