"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
const import_declaration_1 = require("./visitors/import_declaration");
const opaque_type_1 = require("./visitors/opaque_type");
const type_annotation_1 = require("./visitors/type_annotation");
const type_cast_expression_1 = require("./visitors/type_cast_expression");
const type_parameter_declaration_1 = require("./visitors/type_parameter_declaration");
const class_declaration_1 = require("./visitors/class_declaration");
const export_declaration_1 = require("./visitors/export_declaration");
exports.default = plugin_1.buildPlugin([
    type_annotation_1.TypeAnnotation,
    type_annotation_1.TypeAlias,
    type_annotation_1.NullableTypeAnnotation,
    type_parameter_declaration_1.TypeParameterDeclaration,
    import_declaration_1.ImportDeclaration,
    import_declaration_1.ImportSpecifier,
    type_cast_expression_1.TypeCastExpression,
    opaque_type_1.OpaqueType,
    class_declaration_1.ClassMethod,
    class_declaration_1.ClassDeclaration,
    export_declaration_1.ExportNamedDeclaration,
    export_declaration_1.ExportDefaultDeclaration,
]);
//# sourceMappingURL=index.js.map