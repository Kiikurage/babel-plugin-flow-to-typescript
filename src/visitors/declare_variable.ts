import { DeclareVariable } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertDeclareVariable } from '../converters/convert_declare_variable';
import { replaceWith } from '../utils/replaceWith';

export function DeclareVariable(path: NodePath<DeclareVariable>) {
  const replacement = convertDeclareVariable(path.node);
  replacement.declare = true;
  replaceWith(path, replacement);
}
