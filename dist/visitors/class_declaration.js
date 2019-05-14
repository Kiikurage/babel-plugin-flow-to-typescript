"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert_class_constructor_1 = require("../converters/convert_class_constructor");
const convert_flow_type_1 = require("../converters/convert_flow_type");
function ClassMethod(path) {
    if (path.node.kind === 'constructor') {
        path.replaceWith(convert_class_constructor_1.convertClassConstructor(path));
    }
}
exports.ClassMethod = ClassMethod;
function processTypeParameters(typeParameterPath) {
    typeParameterPath.node.params = typeParameterPath.node.params.map((_, i) => convert_flow_type_1.convertFlowType(typeParameterPath.get(`params.${i}`)));
}
function ClassDeclaration(path) {
    const superTypeParametersPath = path.get('superTypeParameters');
    if (superTypeParametersPath.node) {
        processTypeParameters(superTypeParametersPath);
    }
    const typeParameterPath = path.get('typeParameters');
    if (typeParameterPath.node) {
        processTypeParameters(typeParameterPath);
    }
    const classImplements = path.get('implements');
    if (Array.isArray(classImplements)) {
        // @ts-ignore
        classImplements.forEach(classImplementsPath => {
            const typeParameterPath = classImplementsPath.get('typeParameters');
            if (typeParameterPath.node) {
                processTypeParameters(typeParameterPath);
            }
        });
    }
}
exports.ClassDeclaration = ClassDeclaration;
//# sourceMappingURL=class_declaration.js.map