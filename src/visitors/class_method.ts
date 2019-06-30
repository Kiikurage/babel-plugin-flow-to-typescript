import { ClassMethod } from '@babel/types';
import { NodePath } from '@babel/traverse';

export function ClassMethod(path: NodePath<ClassMethod>) {
  if (path.node.kind === 'constructor') {
    path.get('returnType').remove();
  }
}
