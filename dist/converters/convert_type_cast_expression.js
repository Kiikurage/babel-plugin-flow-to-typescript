"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const convert_flow_type_1 = require("./convert_flow_type");
function convertTypeCastExpression(path) {
    return types_1.tsAsExpression(path.node.expression, convert_flow_type_1.convertFlowType(path.get('typeAnnotation').get('typeAnnotation')));
}
exports.convertTypeCastExpression = convertTypeCastExpression;
//# sourceMappingURL=convert_type_cast_expression.js.map