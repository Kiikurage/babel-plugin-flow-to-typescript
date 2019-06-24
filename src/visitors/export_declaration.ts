import {
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  isTypeCastExpression,
  variableDeclaration,
  variableDeclarator,
  exportDefaultDeclaration,
  identifier,
} from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeAnnotation } from '../converters/convert_type_annotation';

export function ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
  // @ts-ignore // todo: @babel/types
  path.node.exportKind = null;
}

export function ExportDefaultDeclaration(path: NodePath<ExportDefaultDeclaration>) {
  const declaration = path.node.declaration;
  if (!isTypeCastExpression(declaration)) {
    return;
  }
  // ex: export default ('some': Thing)
  const exportVariableName = path.scope.generateUidIdentifier('moduleExport');

  exportVariableName.typeAnnotation = convertTypeAnnotation(declaration.typeAnnotation);

  path.insertBefore(
    variableDeclaration('const', [variableDeclarator(exportVariableName, declaration.expression)]),
  );
  path.replaceWith(exportDefaultDeclaration(identifier(exportVariableName.name)));
}
