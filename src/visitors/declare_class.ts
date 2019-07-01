import { DeclareClass } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertDeclareClass } from '../converters/convert_declare_class';

declare module '@babel/types' {
  interface ObjectTypeProperty {
    method: boolean;
  }
}

export function DeclareClass(path: NodePath<DeclareClass>) {
  const decl = convertDeclareClass(path.node);
  decl.declare = true;

  path.replaceWith(decl);
}
