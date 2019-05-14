"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const convert_type_parameter_1 = require("./convert_type_parameter");
function convertTypeParameterDeclaration(path) {
    const params = path.node.params.map((_, i) => convert_type_parameter_1.convertTypeParameter(path.get(`params.${i}`)));
    return types_1.tsTypeParameterDeclaration(params);
}
exports.convertTypeParameterDeclaration = convertTypeParameterDeclaration;
//# sourceMappingURL=convert_type_parameter_declaration.js.map