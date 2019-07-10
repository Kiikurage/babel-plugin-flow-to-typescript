import { tsTypeAnnotation, TSTypeAnnotation, TypeAnnotation } from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';

export function convertTypeAnnotation(node: TypeAnnotation): TSTypeAnnotation {
  return tsTypeAnnotation({
    ...convertFlowType(node.typeAnnotation),
    ...baseNodeProps(node.typeAnnotation),
  });
}
