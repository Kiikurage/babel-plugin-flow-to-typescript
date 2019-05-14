"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert_opaque_type_1 = require("../converters/convert_opaque_type");
function OpaqueType(path) {
    path.replaceWith(convert_opaque_type_1.convertOpaqueType(path));
}
exports.OpaqueType = OpaqueType;
//# sourceMappingURL=opaque_type.js.map