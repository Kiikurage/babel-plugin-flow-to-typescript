import {
  isNullableTypeAnnotation,
  isTSFunctionType,
  ObjectTypeProperty,
  tsMethodSignature,
  tsNullKeyword,
  tsParenthesizedType,
  tsPropertySignature,
  tsTypeAnnotation,
  tsUndefinedKeyword,
  tsUnionType,
} from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';
import { getPropertyKey } from './get_property_key';

export function convertObjectTypeProperty(property: ObjectTypeProperty) {
  let tsType;
  if (!isNullableTypeAnnotation(property.value)) {
    tsType = convertFlowType(property.value);
  } else {
    let tsValueT = convertFlowType(property.value.typeAnnotation);
    if (isTSFunctionType(tsValueT)) {
      tsValueT = tsParenthesizedType(tsValueT);
    }
    if (property.optional) {
      // { key?: ?T } -> { key?: T | null }
      tsType = tsUnionType([tsValueT, tsNullKeyword()]);
    } else {
      // { key: ?T } -> { key: T | null | undefined }
      tsType = tsUnionType([tsValueT, tsUndefinedKeyword(), tsNullKeyword()]);
    }
  }

  const { key, isComputed } = getPropertyKey(property);

  if (property.method) {
    if (!isTSFunctionType(tsType)) {
      throw new Error('incorrect method declaration');
    }
    const tsMethod = tsMethodSignature(
      key,
      tsType.typeParameters,
      tsType.parameters,
      tsType.typeAnnotation,
    );

    tsMethod.optional = property.optional;
    tsMethod.computed = isComputed;
    return tsMethod;
  } else {
    const tsPropSignature = tsPropertySignature(
      key,
      tsTypeAnnotation({ ...tsType, ...baseNodeProps(property.value) }),
    );
    tsPropSignature.optional = property.optional;
    tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
    tsPropSignature.computed = isComputed;
    return tsPropSignature;
  }
}
