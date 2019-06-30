import {
  ObjectTypeProperty,
  tsPropertySignature,
  tsTypeAnnotation,
} from '@babel/types';
import { convertFlowType } from './convert_flow_type';

export function convertObjectTypeProperty(property: ObjectTypeProperty) {
  const tsPropSignature = tsPropertySignature(
    property.key,
    tsTypeAnnotation(convertFlowType(property.value)),
  );
  tsPropSignature.optional = property.optional;
  tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
  return tsPropSignature;
}
