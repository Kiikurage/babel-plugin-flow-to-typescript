import { NodePath } from '@babel/traverse';
import { ExportDeclaration } from '@babel/types';

export function convertEmportDeclaration(path: NodePath<ExportDeclaration>): ExportDeclaration {
  //tslint:disable:no-any
  (path.node as any).exportKind = null;
  return path.node;
}
