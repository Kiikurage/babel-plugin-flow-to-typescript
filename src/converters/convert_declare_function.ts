import {
  DeclareFunction,
  tsDeclareFunction,
  isTypeAnnotation,
  isFunctionTypeAnnotation,
} from '@babel/types';

import { convertFunctionTypeAnnotation } from './convert_function_type_annotation';

export function convertDeclareFunction(node: DeclareFunction) {
  // todo: partially duplicated logic from convert_flow_type.ts, which was already updated
  if (!isTypeAnnotation(node.id.typeAnnotation)) return node;

  const typeAnnotation = node.id.typeAnnotation.typeAnnotation;
  if (!isFunctionTypeAnnotation(typeAnnotation)) return node;

  const { typeParams, parameters, returnType } = convertFunctionTypeAnnotation(typeAnnotation);

  return tsDeclareFunction(node.id, typeParams, parameters, returnType);
}
