"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const util_1 = require("../util");
const convert_flow_type_1 = require("./convert_flow_type");
function convertOpaqueType(path) {
    if (path.node.supertype)
        util_1.warnOnlyOnce('Subtyping constraints in opaque type in Flow is ignored in TypeScript');
    const tsNode = types_1.tsTypeAliasDeclaration(path.node.id, null, convert_flow_type_1.convertFlowType(path.get('impltype')));
    tsNode.declare = false;
    return tsNode;
}
exports.convertOpaqueType = convertOpaqueType;
//# sourceMappingURL=convert_opaque_type.js.map