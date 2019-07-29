import {
  isFunctionTypeAnnotation,
  ObjectTypeCallProperty,
  tsCallSignatureDeclaration,
} from '@babel/types';
import { convertFunctionTypeAnnotation } from './convert_function_type_annotation';

export function convertObjectTypeCallProperty(callProperty: ObjectTypeCallProperty) {
  if (isFunctionTypeAnnotation(callProperty.value)) {
    const { typeParams, parameters, returnType } = convertFunctionTypeAnnotation(
      callProperty.value,
    );

    return tsCallSignatureDeclaration(typeParams, parameters, returnType);
  } else {
    throw new Error('ObjectCallTypeProperty case not implemented');
  }
}
