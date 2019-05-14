"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert_type_parameter_declaration_1 = require("../converters/convert_type_parameter_declaration");
function TypeParameterDeclaration(path) {
    path.replaceWith(convert_type_parameter_declaration_1.convertTypeParameterDeclaration(path));
}
exports.TypeParameterDeclaration = TypeParameterDeclaration;
//# sourceMappingURL=type_parameter_declaration.js.map