import { DeclareTypeAlias } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertDeclareTypeAlias } from '../converters/convert_declare_type_alias';
import { replaceWith } from '../utils/replaceWith';

export function DeclareTypeAlias(path: NodePath<DeclareTypeAlias>) {
  const node = path.node;
  const replacement = convertDeclareTypeAlias(node);
  replacement.declare = true;
  replaceWith(path, replacement);
}
