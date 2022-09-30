function build(countName: string) {
    return `count(*) AS ${countName}`;
}

export default {
    build
}