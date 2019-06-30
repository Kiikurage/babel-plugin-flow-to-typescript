import { NodePath } from '@babel/traverse';
import {
  DeclareModuleExports,
  identifier,
  isExpression,
  isIdentifier,
  isTSTypeReference,
  tsExportAssignment,
  tsTypeAliasDeclaration,
} from '@babel/types';
import { convertFlowType } from '../converters/convert_flow_type';

export function DeclareModuleExports(path: NodePath<DeclareModuleExports>) {
  const node = path.node;

  const tsType = convertFlowType(node.typeAnnotation.typeAnnotation);

  if (isExpression(tsType)) {
    const replacement = tsExportAssignment(tsType);
    path.replaceWith(replacement);
  } else if (isTSTypeReference(tsType) && isIdentifier(tsType.typeName)) {
    const replacement = tsExportAssignment(tsType.typeName);
    path.replaceWith(replacement);
  } else {
    const aliasId = identifier('__exports');

    path.replaceWithMultiple([
      tsTypeAliasDeclaration(aliasId, null, tsType),
      tsExportAssignment(aliasId),
    ]);
  }
}
