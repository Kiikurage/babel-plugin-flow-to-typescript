import { ImportDeclaration, ImportSpecifier } from '@babel/types';
import { NodePath } from '@babel/traverse';

export function ImportDeclaration(path: NodePath<ImportDeclaration>) {
  path.node.importKind = null;
}

export function ImportSpecifier(path: NodePath<ImportSpecifier>) {
  path.node.importKind = null;
}
