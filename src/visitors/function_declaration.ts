import {
  FunctionDeclaration,
  isNullableTypeAnnotation,
  isTypeAnnotation,
  tsNullKeyword,
  TSType,
  tsTypeAnnotation,
  tsUnionType,
} from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertFlowType } from '../converters/convert_flow_type';

export function FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
  path.get('params').forEach((paramNode: NodePath<FunctionDeclaration['params'][number]>) => {
    if (paramNode.isIdentifier()) {
      const param = paramNode.node;
      const paramTypeAnnotationPath = paramNode.get('typeAnnotation');

      if (param.typeAnnotation && isTypeAnnotation(param.typeAnnotation)) {
        let typeAnnotation: TSType;
        if (isNullableTypeAnnotation(param.typeAnnotation.typeAnnotation)) {
          if (param.optional) {
            typeAnnotation = tsUnionType([
              convertFlowType(param.typeAnnotation.typeAnnotation.typeAnnotation),
              tsNullKeyword(),
            ]);
            paramTypeAnnotationPath.replaceWith(tsTypeAnnotation(typeAnnotation));
          }
        }
      }
    }
  });
}
