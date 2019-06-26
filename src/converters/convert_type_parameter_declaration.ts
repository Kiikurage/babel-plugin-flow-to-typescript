import {
  TSTypeParameterDeclaration,
  tsTypeParameterDeclaration,
  TypeParameterDeclaration,
} from '@babel/types';
import { convertTypeParameter } from './convert_type_parameter';
import { baseNodeProps } from '../utils/baseNodeProps';

export function convertTypeParameterDeclaration(
  node: TypeParameterDeclaration,
): TSTypeParameterDeclaration {
  const params = node.params.map(p => ({
    ...baseNodeProps(p),
    ...convertTypeParameter(p),
  }));

  return tsTypeParameterDeclaration(params);
}
