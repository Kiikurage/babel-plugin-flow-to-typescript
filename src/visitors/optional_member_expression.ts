import { OptionalMemberExpression } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertMemberExpression } from '../converters/convert_member_expression';

export function OptionalMemberExpression(path: NodePath<OptionalMemberExpression>) {
  path.replaceWith(convertMemberExpression(path.node));
}
