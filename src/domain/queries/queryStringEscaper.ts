// TODO: Beef this function up to add additionnal security. 
// Notes: Pure sql query sanitization requires consumming sql db systeme to know which portions of query correspond to which arguments.
// Correcting this behavior requires to use a 3rd party library to execute sql instead of using aidbox $sql rest service.
function escape(content: string) {
    return content
        .replace('--', '')
        .replace("'", "")
        .replace('drop', '');
}

export default {
    escape
}