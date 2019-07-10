import { DeclareFunction } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertDeclareFunction } from '../converters/convert_declare_function';
import { recastProps } from '../utils/recastProps';

export function DeclareFunction(path: NodePath<DeclareFunction>) {
  const replacement = convertDeclareFunction(path.node);
  replacement.declare = true;
  path.replaceWith({ ...recastProps(path.node), ...replacement });
}
