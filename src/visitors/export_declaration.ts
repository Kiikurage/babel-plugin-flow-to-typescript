import { ExportNamedDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';

export function ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
  path.node.exportKind = null;
}
