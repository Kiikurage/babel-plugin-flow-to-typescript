import {
  DeclareClass,
  classDeclaration,
  classBody,
  classProperty,
  tsDeclareMethod,
  tsTypeAnnotation,
  tsParenthesizedType,
  isTSFunctionType,
  isObjectTypeSpreadProperty,
  ClassBody,
  isTypeParameterDeclaration,
  isIdentifier,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { warnOnlyOnce } from '../util';
import { convertFlowType } from '../converters/convert_flow_type';
import { convertInterfaceExtends } from '../converters/convert_interface_declaration';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { convertObjectTypeIndexer } from '../converters/convert_object_type_indexer';
import { baseNodeProps } from '../utils/baseNodeProps';

declare module '@babel/types' {
  interface ObjectTypeProperty {
    method: boolean;
  }
}

export function DeclareClass(path: NodePath<DeclareClass>) {
  const node = path.node;

  const bodyElements: ClassBody['body'] = [];

  for (const property of node.body.properties) {
    if (isObjectTypeSpreadProperty(property)) {
      throw path.buildCodeFrameError('ObjectTypeSpreadProperty is unexpected in DeclareClass');
    }

    let convertedProperty = convertFlowType(property.value);
    if (isTSFunctionType(convertedProperty)) {
      convertedProperty = tsParenthesizedType(convertedProperty);
    }

    if (property.method) {
      const converted = tsDeclareMethod(
        null,
        property.key,
        null, // todo: convertedProperty.typeParameters,
        // @ts-ignore
        convertedProperty.typeAnnotation.parameters,
        // @ts-ignore
        convertedProperty.typeAnnotation.typeAnnotation,
      );

      converted.static = property.static;
      // @ts-ignore
      converted.kind = property.kind;
      bodyElements.push(converted);
    } else if (property.kind === 'init') {
      const converted = classProperty(property.key, null, tsTypeAnnotation(convertedProperty));
      converted.static = property.static;
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

  const decl = classDeclaration(path.node.id, superClass, body, []);

  decl.implements = _implements;
  decl.superTypeParameters = superTypeParameters;
  decl.typeParameters = typeParameters;
  decl.declare = true;

  path.replaceWith(decl);
}
