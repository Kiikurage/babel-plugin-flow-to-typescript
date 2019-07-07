import {
  isTSFunctionType,
  ObjectTypeProperty,
  tsMethodSignature,
  tsPropertySignature,
  tsTypeAnnotation,
} from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';

export function convertObjectTypeProperty(property: ObjectTypeProperty) {
  const tsType = convertFlowType(property.value);
  if (property.method) {
    if (!isTSFunctionType(tsType)) {
      throw new Error('incorrect method declaration');
    }
    const tsMethod = tsMethodSignature(
      property.key,
      tsType.typeParameters,
      tsType.parameters,
      tsType.typeAnnotation,
    );

    tsMethod.optional = property.optional;
    return tsMethod;
  } else {
    const tsPropSignature = tsPropertySignature(
      property.key,
      tsTypeAnnotation({ ...tsType, ...baseNodeProps(property.value) }),
    );
    tsPropSignature.optional = property.optional;
    tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
    return tsPropSignature;
  }
}
