import { DeclareFunction } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertDeclareFunction } from '../converters/convert_declare_function';

export function DeclareFunction(path: NodePath<DeclareFunction>) {
  const replacement = convertDeclareFunction(path.node);
  replacement.declare = true;
  path.replaceWith(replacement);
}
