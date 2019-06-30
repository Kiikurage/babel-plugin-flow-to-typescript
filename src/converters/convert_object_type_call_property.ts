import {
  isFunctionTypeAnnotation,
  ObjectTypeCallProperty,
  tsCallSignatureDeclaration,
} from '@babel/types';
import { convertFunctionTypeAnnotation } from './convert_function_type_annotation';

export function convertObjectTypeCallProperty(callPropperty: ObjectTypeCallProperty) {
  if (isFunctionTypeAnnotation(callPropperty.value)) {
    const { typeParams, parameters, returnType } = convertFunctionTypeAnnotation(
      callPropperty.value,
    );

    return tsCallSignatureDeclaration(typeParams, parameters, returnType);
  } else {
    throw new Error('ObjectCallTypeProperty case not implemented');
  }
}
