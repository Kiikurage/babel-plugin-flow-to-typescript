"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const convert_flow_type_1 = require("./convert_flow_type");
function convertTypeParameter(path) {
    const tsNode = types_1.tsTypeParameter();
    if (path.node.bound)
        tsNode.constraint = convert_flow_type_1.convertFlowType(path.get('bound').get('typeAnnotation'));
    tsNode.name = path.node.name;
    return tsNode;
}
exports.convertTypeParameter = convertTypeParameter;
//# sourceMappingURL=convert_type_parameter.js.map