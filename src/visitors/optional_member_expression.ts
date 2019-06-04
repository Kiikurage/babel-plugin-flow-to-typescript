import {
  nullLiteral,
  binaryExpression,
  memberExpression,
  conditionalExpression,
  isOptionalMemberExpression,
  Identifier,
  MemberExpression,
  ConditionalExpression,
  OptionalMemberExpression,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

type MemberType = Identifier | MemberExpression;

function getMemberExpression(members: MemberType[]): MemberExpression | Identifier {
  if (members.length === 1) {
    return members[0];
  }

  const lastMember = members.pop();
  return memberExpression(
    members.length === 1 ? members[0] : getMemberExpression(members),
    lastMember,
  );
}
function getConditionalExpression(members: MemberType[], index: number): ConditionalExpression {
  const currentMember = getMemberExpression(members.slice(0, index + 1));
  const isLastMember = index === members.length - 1;

  return conditionalExpression(
    binaryExpression('==', currentMember, nullLiteral()),
    nullLiteral(),
    isLastMember ? currentMember : getConditionalExpression(members, index + 1),
  );
}

export function OptionalMemberExpression(path: NodePath<OptionalMemberExpression>) {
  const objChainReverse = [];
  let current: any = path.node;

  do {
    objChainReverse.push(current.property);
    if (!isOptionalMemberExpression(current.object)) {
      objChainReverse.push(current.object);
      break;
    }
    current = current.object;
  } while (current);

  const objChain = objChainReverse.reverse();
  path.replaceWith(getConditionalExpression(objChain, 0));
}
