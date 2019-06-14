import {NodePath} from '@babel/traverse';
import {
    classMethod,
    ClassMethod,
} from '@babel/types';

 export function convertClassConstructor(path: NodePath<ClassMethod>): ClassMethod {
    const node = path.node;

    if (node.returnType === null) return node;

    const ret = classMethod(node.kind, node.key, node.params, node.body, node.computed, node.static);
    ret.returnType = null;

    return ret;
}
