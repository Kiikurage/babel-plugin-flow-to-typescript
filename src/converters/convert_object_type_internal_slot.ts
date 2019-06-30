import {
  isFunctionTypeAnnotation,
  ObjectTypeInternalSlot,
  tsMethodSignature,
  tsPropertySignature,
  tsTypeAnnotation,
} from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { convertFunctionTypeAnnotation } from './convert_function_type_annotation';

export function convertObjectTypeInternalSlot(property: ObjectTypeInternalSlot) {
  if (property.method) {
    if (!isFunctionTypeAnnotation(property.value)) {
      throw new Error('FunctionTypeAnnotation expected');
    }
    const { typeParams, parameters, returnType } = convertFunctionTypeAnnotation(property.value);
    return tsMethodSignature(
      property.id,
      typeParams,
      parameters,
      returnType,
      true,
      property.optional,
    );
  } else {
    const tsPropSignature = tsPropertySignature(
      property.id,
      tsTypeAnnotation(convertFlowType(property.value)),
    );
    tsPropSignature.optional = property.optional;
    tsPropSignature.computed = true;
    // todo: property.static;
    return tsPropSignature;
  }
}
