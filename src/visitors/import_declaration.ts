import { ImportSpecifier } from '@babel/types';
import { NodePath } from '@babel/traverse';

export function ImportSpecifier(path: NodePath<ImportSpecifier>) {
  path.node.importKind = null;
}
