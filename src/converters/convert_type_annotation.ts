import { tsTypeAnnotation, TSTypeAnnotation, TypeAnnotation } from '@babel/types';
import { convertFlowType } from './convert_flow_type';

export function convertTypeAnnotation(node: TypeAnnotation): TSTypeAnnotation {
  return tsTypeAnnotation(convertFlowType(node.typeAnnotation));
}
