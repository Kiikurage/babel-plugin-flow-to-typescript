import { ExportNamedDeclaration} from '@babel/types';
import {NodePath} from '@babel/traverse';

export function ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
  // @ts-ignore
  path.node.exportKind = null
}
