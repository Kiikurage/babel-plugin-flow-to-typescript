import { tsAsExpression, TSAsExpression, TypeCastExpression } from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';
import { recastProps } from '../utils/recastProps';

export function convertTypeCastExpression(node: TypeCastExpression): TSAsExpression {
  return {
    ...tsAsExpression(node.expression, {
      ...baseNodeProps(node.typeAnnotation.typeAnnotation),
      ...convertFlowType(node.typeAnnotation.typeAnnotation),
    }),
    ...recastProps(node),
  };
}
