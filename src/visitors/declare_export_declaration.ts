import { NodePath } from '@babel/traverse';
import {
  DeclareExportDeclaration,
  exportDefaultDeclaration,
  exportNamedDeclaration,
  identifier,
  isDeclareClass,
  isDeclareFunction,
  isDeclareVariable,
  isFlowType,
  isInterfaceDeclaration,
  isTypeAlias,
  tsTypeAnnotation,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';

import { convertFlowType } from '../converters/convert_flow_type';
import { convertDeclareVariable } from '../converters/convert_declare_variable';
import { convertDeclareFunction } from '../converters/convert_declare_function';
import { convertDeclareTypeAlias } from '../converters/convert_declare_type_alias';
import { convertDeclareClass } from '../converters/convert_declare_class';
import { replaceWith } from '../utils/replaceWith';
import { convertInterfaceDeclaration } from '../converters/convert_interface_declaration';

export function DeclareExportDeclaration(path: NodePath<DeclareExportDeclaration>) {
  const node = path.node;

  let replacement;
  if (node.default) {
    if (!node.declaration) {
      throw path.buildCodeFrameError('todo: declaration is missing');
    }
    if (isDeclareFunction(node.declaration)) {
      replacement = exportDefaultDeclaration(convertDeclareFunction(node.declaration));
      replaceWith(path, replacement);
    } else if (isDeclareClass(node.declaration)) {
      replacement = exportDefaultDeclaration(convertDeclareClass(node.declaration));
      replaceWith(path, replacement);
    } else {
      if (!isFlowType(node.declaration)) {
        throw path.buildCodeFrameError('not implemented');
      }
      const declaration = convertFlowType(node.declaration);

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
    } else if (isDeclareClass(node.declaration)) {
      declaration = convertDeclareClass(node.declaration);
    } else if (isInterfaceDeclaration(node.declaration)) {
      declaration = convertInterfaceDeclaration(node.declaration);
    } else {
      throw path.buildCodeFrameError(`DeclareExportDeclaration not converted`);
    }
    replacement = exportNamedDeclaration(
      declaration,
      node.specifiers ? node.specifiers : [],
      node.source,
    );
    replaceWith(path, replacement);
  }
}
