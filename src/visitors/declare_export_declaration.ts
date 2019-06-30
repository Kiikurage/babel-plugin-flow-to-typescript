import { NodePath } from '@babel/traverse';
import {
  DeclareExportDeclaration,
  exportDefaultDeclaration,
  exportNamedDeclaration,
  identifier,
  isClassDeclaration,
  isDeclareFunction,
  isDeclareVariable,
  isExpression,
  isFlowType,
  isFunctionDeclaration,
  isTSDeclareFunction,
  isTypeAlias,
  tsTypeAnnotation,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';

import { convertFlowType } from '../converters/convert_flow_type';
import { convertDeclareVariable } from '../converters/convert_declare_variable';
import { convertDeclareFunction } from '../converters/convert_declare_function';
import { convertDeclareTypeAlias } from '../converters/convert_declare_type_alias';

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
    let declaration = null;
    if (isDeclareVariable(node.declaration)) {
      declaration = convertDeclareVariable(node.declaration);
    } else if (isDeclareFunction(node.declaration)) {
      declaration = convertDeclareFunction(node.declaration);
    } else if (isTypeAlias(node.declaration)) {
      declaration = convertDeclareTypeAlias(node.declaration);
    }
    if (node.declaration !== null && declaration === null) {
      throw path.buildCodeFrameError('declaration not converted');
    }
    replacement = exportNamedDeclaration(
      declaration,
      node.specifiers ? node.specifiers : [],
      node.source,
    );
    path.replaceWith(replacement);
  }
}
