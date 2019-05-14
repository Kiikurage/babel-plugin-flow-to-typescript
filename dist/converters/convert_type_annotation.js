"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const convert_flow_type_1 = require("./convert_flow_type");
const convert_type_parameter_declaration_1 = require("./convert_type_parameter_declaration");
function convertTypeAnnotation(path) {
    return types_1.tsTypeAnnotation(convert_flow_type_1.convertFlowType(path.get('typeAnnotation')));
}
exports.convertTypeAnnotation = convertTypeAnnotation;
function convertTypeAlias(path) {
    const typeParameters = path.get('typeParameters');
    const right = path.get('right');
    return types_1.tsTypeAliasDeclaration(path.node.id, typeParameters.isTypeParameterDeclaration() ? convert_type_parameter_declaration_1.convertTypeParameterDeclaration(typeParameters) : null, convert_flow_type_1.convertFlowType(right));
}
exports.convertTypeAlias = convertTypeAlias;
//# sourceMappingURL=convert_type_annotation.js.map