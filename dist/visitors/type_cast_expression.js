"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert_type_cast_expression_1 = require("../converters/convert_type_cast_expression");
function TypeCastExpression(path) {
    path.replaceWith(convert_type_cast_expression_1.convertTypeCastExpression(path));
}
exports.TypeCastExpression = TypeCastExpression;
//# sourceMappingURL=type_cast_expression.js.map