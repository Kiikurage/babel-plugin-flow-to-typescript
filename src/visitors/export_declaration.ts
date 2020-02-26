import { ExportNamedDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';

export function ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
  if (path.node.declaration) {
    path.node.exportKind = null;
  }
}
