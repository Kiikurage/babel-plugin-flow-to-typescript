import { DeclareInterface } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertInterfaceDeclaration } from '../converters/convert_interface_declaration';
import { replaceWith } from '../utils/replaceWith';
import { PluginPass } from '../types';

export function DeclareInterface(path: NodePath<DeclareInterface>, state: PluginPass) {
  const node = path.node;
  const replacement = convertInterfaceDeclaration(node);
  replacement.declare = !state.get('isModuleDeclaration');
  replaceWith(path, replacement);
}
