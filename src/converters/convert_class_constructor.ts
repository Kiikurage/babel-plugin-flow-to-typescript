import { ClassMethod } from '@babel/types';

export function convertClassConstructor(node: ClassMethod): ClassMethod {
  if (node.returnType === null) return node;

  return { ...node, returnType: null };
}
