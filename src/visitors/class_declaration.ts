import {
  ClassDeclaration,
  isTypeParameterInstantiation,
  isTypeParameterDeclaration,
  ClassImplements, ClassExpression,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertInterfaceExtends } from '../converters/convert_interface_declaration';
import { convertTypeParameterInstantiation } from '../converters/convert_type_parameter_instantiation';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';

export function ClassDeclaration(path: NodePath<ClassDeclaration | ClassExpression>) {
  const node = path.node;

  const superTypeParameters = node.superTypeParameters;
  if (isTypeParameterInstantiation(superTypeParameters)) {
    path
      .get('superTypeParameters')
      .replaceWith(convertTypeParameterInstantiation(superTypeParameters));
  }

  const typeParameters = node.typeParameters;
  if (isTypeParameterDeclaration(typeParameters)) {
    path.get('typeParameters').replaceWith(convertTypeParameterDeclaration(typeParameters));
  }

  const classImplements = node.implements;
  if (Array.isArray(classImplements)) {
    const classImplements = path.get('implements') as NodePath<ClassImplements>[];
    if (classImplements !== null) {
      for (const classImplement of classImplements) {
        if (classImplement.isClassImplements()) {
          classImplement.replaceWith(convertInterfaceExtends(classImplement.node));
        }
      }
    }
  }
}
