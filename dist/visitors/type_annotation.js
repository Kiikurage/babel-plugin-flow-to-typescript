"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert_type_annotation_1 = require("../converters/convert_type_annotation");
const convert_flow_type_1 = require("../converters/convert_flow_type");
function TypeAnnotation(path) {
    path.replaceWith(convert_type_annotation_1.convertTypeAnnotation(path));
}
exports.TypeAnnotation = TypeAnnotation;
function TypeAlias(path) {
    path.replaceWith(convert_type_annotation_1.convertTypeAlias(path));
}
exports.TypeAlias = TypeAlias;
function NullableTypeAnnotation(path) {
    path.replaceWith(convert_flow_type_1.convertFlowType(path));
}
exports.NullableTypeAnnotation = NullableTypeAnnotation;
//# sourceMappingURL=type_annotation.js.map