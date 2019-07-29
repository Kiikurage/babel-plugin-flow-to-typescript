import {
  TSTypeParameterInstantiation,
  tsTypeParameterInstantiation,
  TypeParameterInstantiation,
} from '@babel/types';
import { baseNodeProps } from '../utils/baseNodeProps';
import { convertFlowType } from './convert_flow_type';

export function convertTypeParameterInstantiation(
  node: TypeParameterInstantiation,
): TSTypeParameterInstantiation {
  const params = node.params.map(p => ({
    ...baseNodeProps(p),
    ...convertFlowType(p),
  }));

  return tsTypeParameterInstantiation(params);
}
