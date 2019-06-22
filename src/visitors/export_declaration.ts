import {
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  isTypeCastExpression,
  variableDeclaration,
  variableDeclarator,
  exportDefaultDeclaration,
  identifier,
} from '@babel/types';
import {NodePath} from '@babel/traverse';
import {convertTypeAnnotation} from '../converters/convert_type_annotation';

export function ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {
  // @ts-ignore
  path.node.exportKind = null;
}

export function ExportDefaultDeclaration(
  path: NodePath<ExportDefaultDeclaration>
) {
  const declaration = path.get('declaration');
  if (!isTypeCastExpression(declaration)) {
    return;
  }
  // ex: export default ('some': Thing)
  const exportVariableName = path.scope.generateUidIdentifier('moduleExport');
  // @ts-ignore
  exportVariableName.typeAnnotation = convertTypeAnnotation(declaration.get('typeAnnotation'));

  path.insertBefore(
    variableDeclaration('const', [
      // @ts-ignore
      variableDeclarator(exportVariableName, declaration.node.expression)
    ])
  );
  path.replaceWith(
    exportDefaultDeclaration(identifier(exportVariableName.name))
  );
}
