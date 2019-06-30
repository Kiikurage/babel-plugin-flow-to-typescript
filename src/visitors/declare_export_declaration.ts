import { NodePath } from '@babel/traverse';
import {
  DeclareExportDeclaration,
  exportDefaultDeclaration,
  exportNamedDeclaration,
  identifier,
  isClassDeclaration,
  isExpression,
  isFlowType,
  isFunctionDeclaration,
  isTSDeclareFunction,
  tsTypeAnnotation,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';

import { convertFlowType } from '../converters/convert_flow_type';

export function DeclareExportDeclaration(path: NodePath<DeclareExportDeclaration>) {
  const node = path.node;

  /*
  type: "DeclareExportDeclaration";
  declaration: Flow | null;
  specifiers: Array<ExportSpecifier | ExportNamespaceSpecifier> | null;
  source: StringLiteral | null;
  default: boolean | null;
  */
  let replacement;
  if (node.default) {
    if (!node.declaration) {
      throw path.buildCodeFrameError('todo: declaration is missing');
    }
    if (!isFlowType(node.declaration)) {
      throw path.buildCodeFrameError('todo: declaration is missing');
    }
    const declaration = convertFlowType(node.declaration);
    if (
      isFunctionDeclaration(declaration) ||
      isTSDeclareFunction(declaration) ||
      isClassDeclaration(declaration) ||
      isExpression(declaration)
    ) {
      // @ts-ignore
      replacement = exportDefaultDeclaration(declaration);
      path.replaceWith(replacement);
    } else {
      const aliasId = identifier('__default');

      path.replaceWithMultiple([
        variableDeclaration('const', [
          variableDeclarator({ ...aliasId, typeAnnotation: tsTypeAnnotation(declaration) }),
        ]),
        exportDefaultDeclaration(aliasId),
      ]);
    }
  } else {
    replacement = exportNamedDeclaration(null, node.specifiers ? node.specifiers : [], node.source);
    path.replaceWith(replacement);
  }
}
