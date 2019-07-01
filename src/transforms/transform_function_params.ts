import { NodePath } from '@babel/traverse';
import {
  Identifier,
  isNullableTypeAnnotation,
  isTypeAnnotation,
  Pattern,
  RestElement,
  tsNullKeyword,
  TSParameterProperty,
  tsTypeAnnotation,
  tsUnionType,
} from '@babel/types';
import { convertFlowType } from '../converters/convert_flow_type';

export function transformFunctionParams(
  params: Array<NodePath<Identifier | Pattern | RestElement | TSParameterProperty>>,
) {
  params.forEach(paramNode => {
    if (paramNode.isIdentifier()) {
      const param = paramNode.node;

      if (param.typeAnnotation && isTypeAnnotation(param.typeAnnotation)) {
        if (isNullableTypeAnnotation(param.typeAnnotation.typeAnnotation)) {
          if (param.optional) {
            const typeAnnotation = tsUnionType([
              convertFlowType(param.typeAnnotation.typeAnnotation.typeAnnotation),
              tsNullKeyword(),
            ]);
            paramNode.get('typeAnnotation').replaceWith(tsTypeAnnotation(typeAnnotation));
          }
        }
      }
    }
  });
}
