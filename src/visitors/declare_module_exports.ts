import { NodePath } from '@babel/traverse';
import {
  DeclareModuleExports,
  identifier,
  isExpression,
  tsExportAssignment,
  tsTypeAnnotation,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';
import { convertFlowType } from '../converters/convert_flow_type';

export function DeclareModuleExports(path: NodePath<DeclareModuleExports>) {
  const node = path.node;

  const tsType = convertFlowType(node.typeAnnotation.typeAnnotation);

  if (isExpression(tsType)) {
    const replacement = tsExportAssignment(tsType);
    path.replaceWith(replacement);
  } else {
    const aliasId = identifier('__exports');

    path.replaceWithMultiple([
      variableDeclaration('const', [
        variableDeclarator({ ...aliasId, typeAnnotation: tsTypeAnnotation(tsType) }),
      ]),
      tsExportAssignment(aliasId),
    ]);
  }
}
