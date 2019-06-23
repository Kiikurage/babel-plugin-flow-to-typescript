import {
  TSTypeParameterDeclaration,
  tsTypeParameterDeclaration,
  TypeParameterDeclaration,
} from '@babel/types';
import { convertTypeParameter } from './convert_type_parameter';

export function convertTypeParameterDeclaration(
  node: TypeParameterDeclaration,
): TSTypeParameterDeclaration {
  const params = node.params.map(p => convertTypeParameter(p));

  return tsTypeParameterDeclaration(params);
}
