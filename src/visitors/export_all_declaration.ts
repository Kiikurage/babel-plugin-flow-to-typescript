import { ExportAllDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';

export function ExportAllDeclaration(path: NodePath<ExportAllDeclaration>) {
  // @ts-ignore todo: types in babel
  path.node.exportKind = null;
}
