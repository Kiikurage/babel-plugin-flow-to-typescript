import { NodePath } from '@babel/traverse';
import {
  TSTypeParameterDeclaration,
  tsTypeParameterDeclaration,
  TypeParameter,
  TypeParameterDeclaration,
} from '@babel/types';
import { convertTypeParameter } from './convert_type_parameter';

export function convertTypeParameterDeclaration(
  path: NodePath<TypeParameterDeclaration>,
): TSTypeParameterDeclaration {
  const params = path.node.params.map((_, i) =>
    convertTypeParameter(path.get(`params.${i}`) as NodePath<TypeParameter>),
  );

  return tsTypeParameterDeclaration(params);
}
