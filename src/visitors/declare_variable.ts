import { DeclareVariable } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertDeclareVariable } from '../converters/convert_declare_variable';
import { replaceWith } from '../utils/replaceWith';
import { PluginPass } from '../types';

export function DeclareVariable(path: NodePath<DeclareVariable>, state: PluginPass) {
  const replacement = convertDeclareVariable(path.node);
  replacement.declare = !state.get('isModuleDeclaration');
  replaceWith(path, replacement);
}
