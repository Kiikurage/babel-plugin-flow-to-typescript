import {
  classBody,
  ClassBody,
  classDeclaration,
  classProperty,
  DeclareClass,
  isIdentifier,
  isObjectTypeSpreadProperty,
  isTSFunctionType,
  isTSParenthesizedType,
  isTypeParameterDeclaration,
  tsDeclareMethod,
  tsParenthesizedType,
  tsTypeAnnotation,
} from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';
import { convertObjectTypeIndexer } from './convert_object_type_indexer';
import { warnOnlyOnce } from '../util';
import { convertInterfaceExtends } from './convert_interface_declaration';
import { convertTypeParameterDeclaration } from './convert_type_parameter_declaration';
import { getPropertyKey } from './get_property_key';

export function convertDeclareClass(node: DeclareClass) {
  const bodyElements: ClassBody['body'] = [];

  for (const property of node.body.properties) {
    if (isObjectTypeSpreadProperty(property)) {
      throw new Error('ObjectTypeSpreadProperty is unexpected in DeclareClass');
    }

    let convertedProperty = convertFlowType(property.value);
    if (isTSFunctionType(convertedProperty)) {
      convertedProperty = tsParenthesizedType(convertedProperty);
    }

    const { key, isComputed } = getPropertyKey(property);
    if (property.method) {
      if (
        !isTSParenthesizedType(convertedProperty) ||
        !isTSFunctionType(convertedProperty.typeAnnotation)
      ) {
        throw new Error('incorrect method');
      }

      const converted = tsDeclareMethod(
        null,
        property.key,
        convertedProperty.typeAnnotation.typeParameters,
        convertedProperty.typeAnnotation.parameters,
        convertedProperty.typeAnnotation.typeAnnotation,
      );
      // todo: fix bug in tsDeclareMethod builder to accept member expression
      converted.key = key;
      converted.static = property.static;
      // @ts-ignore
      converted.kind = property.kind;
      converted.computed = isComputed;
      bodyElements.push(converted);
    } else if (property.kind === 'init') {
      const converted = classProperty(key, null, tsTypeAnnotation(convertedProperty));
      converted.static = property.static;
      converted.readonly = property.variance && property.variance.kind === 'plus';
      converted.computed = isComputed;
      bodyElements.push({ ...converted, ...baseNodeProps(property) });
    }
  }

  // todo:
  // if (node.body.callProperties) {
  //   bodyElements.push(...node.body.callProperties.map(convertObjectTypeCallProperty));
  // }

  if (node.body.indexers) {
    // tslint:disable-next-line:prettier
    bodyElements.push(...node.body.indexers.map(i => ({...convertObjectTypeIndexer(i), ...baseNodeProps(i)})));
  }

  // todo:
  // if (node.body.internalSlots) {
  //   bodyElements.push(...node.body.internalSlots.map(convertObjectTypeInternalSlot));
  // }

  let superClass = null;
  let superTypeParameters = null;

  if (node.extends && node.extends.length) {
    if (node.extends.length > 1) {
      warnOnlyOnce(
        'declare-class-many-parents',
        'Declare Class definitions in TS can only have one super class. Dropping extras.',
      );
    }

    const firstExtend = convertInterfaceExtends(node.extends[0]);
    if (isIdentifier(firstExtend.expression)) {
      superClass = { ...firstExtend.expression, ...baseNodeProps(node.extends[0].id) };
      if (firstExtend.typeParameters && node.extends[0].typeParameters) {
        superTypeParameters = {
          ...firstExtend.typeParameters,
          ...baseNodeProps(node.extends[0].typeParameters),
        };
      }
    } else {
      throw new Error('not implemented');
    }
  }

  let typeParameters = null;
  if (isTypeParameterDeclaration(node.typeParameters)) {
    typeParameters = {
      ...convertTypeParameterDeclaration(node.typeParameters),
      ...baseNodeProps(node.typeParameters),
    };
  }

  const body = { ...classBody(bodyElements), ...baseNodeProps(node.body) };
  let _implements = null;
  if (node.implements && node.implements.length) {
    _implements = node.implements.map(i => ({
      ...convertInterfaceExtends(i),
      ...baseNodeProps(i),
    }));
  }

  const decl = classDeclaration(node.id, superClass, body, []);

  decl.implements = _implements;
  decl.superTypeParameters = superTypeParameters;
  decl.typeParameters = typeParameters;

  return decl;
}
