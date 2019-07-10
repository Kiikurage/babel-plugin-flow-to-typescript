import { NodePath } from '@babel/traverse';
import { DeclareOpaqueType, tsTypeAliasDeclaration, tsUnknownKeyword } from '@babel/types';
import { warnOnlyOnce } from '../util';
import { replaceWith } from '../utils/replaceWith';
import { PluginPass } from '../types';

export function DeclareOpaqueType(path: NodePath<DeclareOpaqueType>, state: PluginPass) {
  const node = path.node;
  if (node.supertype) {
    warnOnlyOnce('Subtyping constraints in opaque type in Flow is ignored in TypeScript');
  }
  const replacement = tsTypeAliasDeclaration(node.id, null, tsUnknownKeyword());
  replacement.declare = !state.get('isModuleDeclaration');

  replaceWith(path, replacement);
}
