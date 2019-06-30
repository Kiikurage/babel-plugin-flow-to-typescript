import { ObjectTypeProperty, tsPropertySignature, tsTypeAnnotation } from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';

export function convertObjectTypeProperty(property: ObjectTypeProperty) {
  const tsPropSignature = tsPropertySignature(
    property.key,
    tsTypeAnnotation({ ...convertFlowType(property.value), ...baseNodeProps(property.value) }),
  );
  tsPropSignature.optional = property.optional;
  tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
  return tsPropSignature;
}
