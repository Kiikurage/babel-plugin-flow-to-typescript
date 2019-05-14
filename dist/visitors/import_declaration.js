"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert_import_declaration_1 = require("../converters/convert_import_declaration");
function ImportDeclaration(path) {
    path.replaceWith(convert_import_declaration_1.convertImportDeclaration(path));
}
exports.ImportDeclaration = ImportDeclaration;
function ImportSpecifier(path) {
    path.node.importKind = null;
}
exports.ImportSpecifier = ImportSpecifier;
//# sourceMappingURL=import_declaration.js.map