import { tsAsExpression, TSAsExpression, TypeCastExpression } from '@babel/types';
import { convertFlowType } from './convert_flow_type';

export function convertTypeCastExpression(node: TypeCastExpression): TSAsExpression {
  return tsAsExpression(node.expression, convertFlowType(node.typeAnnotation.typeAnnotation));
}
