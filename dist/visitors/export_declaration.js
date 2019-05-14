"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const convert_type_annotation_1 = require("../converters/convert_type_annotation");
function ExportNamedDeclaration(path) {
    // @ts-ignore
    path.node.exportKind = null;
}
exports.ExportNamedDeclaration = ExportNamedDeclaration;
function ExportDefaultDeclaration(path) {
    const declaration = path.get('declaration');
    if (!types_1.isTypeCastExpression(declaration)) {
        return;
    }
    // ex: export default ('some': Thing)
    const exportVariableName = path.scope.generateUidIdentifier('moduleExport');
    // @ts-ignore
    exportVariableName.typeAnnotation = convert_type_annotation_1.convertTypeAnnotation(declaration.get('typeAnnotation'));
    path.insertBefore(types_1.variableDeclaration('const', [
        // @ts-ignore
        types_1.variableDeclarator(exportVariableName, declaration.node.expression),
    ]));
    path.replaceWith(types_1.exportDefaultDeclaration(types_1.identifier(exportVariableName.name)));
}
exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
//# sourceMappingURL=export_declaration.js.map