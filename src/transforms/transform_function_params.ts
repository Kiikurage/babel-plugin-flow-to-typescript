import { NodePath } from '@babel/traverse';
import {
  Identifier,
  isIdentifier,
  isNullableTypeAnnotation,
  isTSFunctionType,
  isTypeAnnotation,
  Pattern,
  RestElement,
  tsNullKeyword,
  TSParameterProperty,
  tsParenthesizedType,
  tsTypeAnnotation, tsUndefinedKeyword,
  tsUnionType,
} from '@babel/types';
import { convertFlowType } from '../converters/convert_flow_type';

export function transformFunctionParams(
  params: Array<NodePath<Identifier | Pattern | RestElement | TSParameterProperty>>,
) {
  let hasRequiredAfter = false;
  for (let i = params.length - 1; i >= 0; i--) {
    const paramNode = params[i];
    if (paramNode.isPattern()) {
      if (paramNode.isAssignmentPattern() && isIdentifier(paramNode.node.left)) {
        // argument with default value can not be optional in typescript
        paramNode.node.left.optional = false;
      }
      hasRequiredAfter = true;
    }
    if (paramNode.isIdentifier()) {
      const param = paramNode.node;

      if (param.typeAnnotation && isTypeAnnotation(param.typeAnnotation)) {
        if (isNullableTypeAnnotation(param.typeAnnotation.typeAnnotation)) {
          param.optional = !hasRequiredAfter;
          if (param.optional) {
            let tsType = convertFlowType(param.typeAnnotation.typeAnnotation.typeAnnotation);
            if (isTSFunctionType(tsType)) {
              tsType = tsParenthesizedType(tsType);
            }
            const typeAnnotation = tsUnionType([tsType, tsNullKeyword()]);
            paramNode.get('typeAnnotation').replaceWith(tsTypeAnnotation(typeAnnotation));
          } else {
            hasRequiredAfter = true;
          }
        } else {
          if (param.optional && hasRequiredAfter) {
            param.optional = false;
            let tsType = convertFlowType(param.typeAnnotation.typeAnnotation);
            if (isTSFunctionType(tsType)) {
              tsType = tsParenthesizedType(tsType);
            }
            const typeAnnotation = tsUnionType([tsType, tsUndefinedKeyword(), tsNullKeyword()]);
            paramNode.get('typeAnnotation').replaceWith(tsTypeAnnotation(typeAnnotation));
          }
          hasRequiredAfter = true;
        }
      }
    }
  }
}
