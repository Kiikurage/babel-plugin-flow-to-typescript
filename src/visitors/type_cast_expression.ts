import { TypeCastExpression } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeCastExpression } from '../converters/convert_type_cast_expression';

export function TypeCastExpression(path: NodePath<TypeCastExpression>) {
  path.replaceWith(convertTypeCastExpression(path.node));
}
