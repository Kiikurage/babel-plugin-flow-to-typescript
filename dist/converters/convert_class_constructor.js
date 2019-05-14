"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
function convertClassConstructor(path) {
    const node = path.node;
    if (node.returnType === null)
        return node;
    const ret = types_1.classMethod(node.kind, node.key, node.params, node.body, node.computed, node.static);
    ret.returnType = null;
    return ret;
}
exports.convertClassConstructor = convertClassConstructor;
//# sourceMappingURL=convert_class_constructor.js.map