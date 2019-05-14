"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
function convertImportDeclaration(path) {
    if (path.node.importKind === null)
        return path.node;
    const ret = types_1.importDeclaration(path.node.specifiers, path.node.source);
    ret.importKind = null;
    return ret;
}
exports.convertImportDeclaration = convertImportDeclaration;
//# sourceMappingURL=convert_import_declaration.js.map