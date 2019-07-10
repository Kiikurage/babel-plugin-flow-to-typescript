import { OptionalMemberExpression } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertMemberExpression } from '../converters/convert_member_expression';
import { replaceWith } from '../utils/replaceWith';

export function OptionalMemberExpression(path: NodePath<OptionalMemberExpression>) {
  replaceWith(path, convertMemberExpression(path.node));
}
