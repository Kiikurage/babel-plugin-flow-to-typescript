import { NodePath } from '@babel/traverse';
import { tsAsExpression, TSAsExpression, TypeCastExpression } from '@babel/types';
import { convertFlowType } from './convert_flow_type';

export function convertTypeCastExpression(path: NodePath<TypeCastExpression>): TSAsExpression {
  return tsAsExpression(
    path.node.expression,
    convertFlowType(path.get('typeAnnotation').get('typeAnnotation')),
  );
}
