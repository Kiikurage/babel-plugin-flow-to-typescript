import {
  identifier,
  nullLiteral,
  binaryExpression,
  memberExpression,
  conditionalExpression,
  isOptionalMemberExpression,
  Identifier,
  NumericLiteral,
  MemberExpression,
  ConditionalExpression,
  OptionalMemberExpression,
} from '@babel/types';

type MemberType = Identifier | MemberExpression | NumericLiteral;

function getMemberExpression(members: MemberType[]): MemberType {
  if (members.length === 1) {
    return members[0];
  }

  const lastMember = members.pop();
  return memberExpression(
    members.length === 1 ? members[0] : getMemberExpression(members),
    lastMember,
    lastMember!.type === 'NumericLiteral',
  );
}
function getConditionalExpression(members: MemberType[], index: number): ConditionalExpression {
  const currentMember = getMemberExpression(members.slice(0, index + 1));
  const isLastMember = index === members.length - 1;

  return conditionalExpression(
    binaryExpression('==', currentMember, nullLiteral()),
    identifier('undefined'),
    isLastMember ? currentMember : getConditionalExpression(members, index + 1),
  );
}

export function convertMemberExpression(node: OptionalMemberExpression) {
  const objChainReverse = [];
  let current = node;

  do {
    objChainReverse.push(current.property);
    if (!isOptionalMemberExpression(current.object)) {
      objChainReverse.push(current.object);
      break;
    }
    current = current.object;
  } while (current);

  const objChain = objChainReverse.reverse();

  return getConditionalExpression(objChain, 0);
}
