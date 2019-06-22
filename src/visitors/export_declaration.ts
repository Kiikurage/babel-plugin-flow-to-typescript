import { ExportDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertEmportDeclaration } from '../converters/convert_export_declaration';

export function ExportDeclaration(path: NodePath<ExportDeclaration>) {
  path.replaceWith(convertEmportDeclaration(path));
}
