import { NodePath } from '@babel/traverse';
import { DeclareOpaqueType, tsTypeAliasDeclaration, tsUnknownKeyword } from '@babel/types';
import { warnOnlyOnce } from '../util';
import { replaceWith } from '../utils/replaceWith';

export function DeclareOpaqueType(path: NodePath<DeclareOpaqueType>) {
  const node = path.node;
  if (node.supertype) {
    warnOnlyOnce('Subtyping constraints in opaque type in Flow is ignored in TypeScript');
  }
  const replacement = tsTypeAliasDeclaration(node.id, null, tsUnknownKeyword());
  replacement.declare = true;

  replaceWith(path, replacement);
}
