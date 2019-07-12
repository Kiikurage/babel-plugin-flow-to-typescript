import {
  Expression,
  identifier,
  isIdentifier,
  memberExpression,
  ObjectTypeProperty,
} from '@babel/types';
import { baseNodeProps } from '../utils/baseNodeProps';

export function getPropertyKey(property: ObjectTypeProperty) {
  let key: Expression = property.key;
  let isComputed = false;
  if (isIdentifier(property.key)) {
    if (property.key.name === '@@iterator') {
      isComputed = true;
      key = {
        ...memberExpression(identifier('Symbol'), identifier('iterator')),
        ...baseNodeProps(property.key),
      };
    }
    if (property.key.name === '@@asyncIterator') {
      isComputed = true;
      key = {
        ...memberExpression(identifier('Symbol'), identifier('asyncIterator')),
        ...baseNodeProps(property.key),
      };
    }
  }
  return { key, isComputed };
}
