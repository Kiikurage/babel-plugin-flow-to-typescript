import {
  ClassDeclaration,
  isTypeParameterInstantiation,
  isTypeParameterDeclaration,
  ClassImplements,
  ClassExpression,
  ClassBody,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertInterfaceExtends } from '../converters/convert_interface_declaration';
import { convertTypeParameterInstantiation } from '../converters/convert_type_parameter_instantiation';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { replaceWith } from '../utils/replaceWith';
import { transformClassBody } from '../transforms/transform_class_body';

export function ClassDeclaration(path: NodePath<ClassDeclaration | ClassExpression>) {
  const node = path.node;

  const superTypeParameters = node.superTypeParameters;
  if (isTypeParameterInstantiation(superTypeParameters)) {
    replaceWith(
      path.get('superTypeParameters') as NodePath,
      convertTypeParameterInstantiation(superTypeParameters),
    );
  }

  const typeParameters = node.typeParameters;
  if (isTypeParameterDeclaration(typeParameters)) {
    replaceWith(
      path.get('typeParameters') as NodePath,
      convertTypeParameterDeclaration(typeParameters),
    );
  }

  const classImplements = node.implements;
  if (Array.isArray(classImplements)) {
    const classImplements = path.get('implements') as NodePath<ClassImplements>[];
    if (classImplements !== null) {
      for (const classImplement of classImplements) {
        if (classImplement.isClassImplements()) {
          replaceWith(classImplement, convertInterfaceExtends(classImplement.node));
        }
      }
    }
  }

  transformClassBody(path.get('body') as NodePath<ClassBody>);
}
