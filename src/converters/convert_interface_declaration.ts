import {
  ClassImplements,
  DeclareInterface,
  Identifier,
  InterfaceDeclaration,
  InterfaceExtends,
  isObjectTypeProperty,
  tsExpressionWithTypeArguments,
  tsInterfaceBody,
  tsInterfaceDeclaration,
  tsTypeParameterInstantiation,
} from '@babel/types';

import { convertFlowType } from './convert_flow_type';
import { convertTypeParameterDeclaration } from './convert_type_parameter_declaration';
import { convertObjectTypeProperty } from './convert_object_type_property';
import { baseNodeProps } from '../utils/baseNodeProps';
import { convertObjectTypeCallProperty } from './convert_object_type_call_property';
import { convertObjectTypeIndexer } from './convert_object_type_indexer';
import { convertObjectTypeInternalSlot } from './convert_object_type_internal_slot';

export function convertInterfaceExtends(node: InterfaceExtends | ClassImplements) {
  const typeParameters = node.typeParameters;
  const typeParameterParams = typeParameters ? typeParameters.params : [];
  const parameters = tsTypeParameterInstantiation(
    typeParameterParams.map(item => ({
      ...convertFlowType(item),
      ...baseNodeProps(item),
    })),
  );

  return tsExpressionWithTypeArguments(
    node.id as Identifier,
    typeParameterParams.length ? parameters : null,
  );
}

export function convertInterfaceDeclaration(node: InterfaceDeclaration | DeclareInterface) {
  let typeParameters = null;
  if (node.typeParameters) {
    typeParameters = {
      ...convertTypeParameterDeclaration(node.typeParameters),
      ...baseNodeProps(node.typeParameters),
    };
  }
  let extendsCombined: Array<InterfaceExtends | ClassImplements> = [];
  if (node.extends && node.implements) {
    if (
      node.extends.length &&
      node.implements.length &&
      node.extends[0].start &&
      node.implements[0].start &&
      node.extends[0].start < node.implements[0].start
    ) {
      extendsCombined = [...node.extends, ...node.implements];
    } else {
      extendsCombined = [...node.implements, ...node.extends];
    }
  } else {
    if (node.extends) {
      extendsCombined = node.extends;
    }
    if (node.implements) {
      extendsCombined = node.implements;
    }
  }
  let _extends = undefined;

  if (extendsCombined.length > 0) {
    _extends = extendsCombined.map(v => ({
      ...convertInterfaceExtends(v),
      ...baseNodeProps(v),
    }));
  }

  const bodyElements = [];

  for (const property of node.body.properties) {
    if (isObjectTypeProperty(property)) {
      bodyElements.push({
        ...convertObjectTypeProperty(property),
        ...baseNodeProps(property),
      });
    }
  }
  if (node.body.callProperties) {
    bodyElements.push(
      ...node.body.callProperties.map(v => ({
        ...convertObjectTypeCallProperty(v),
        ...baseNodeProps(v),
      })),
    );
  }
  if (node.body.indexers) {
    bodyElements.push(
      ...node.body.indexers.map(v => ({ ...convertObjectTypeIndexer(v), ...baseNodeProps(v) })),
    );
  }
  if (node.body.internalSlots) {
    bodyElements.push(
      ...node.body.internalSlots.map(v => ({
        ...convertObjectTypeInternalSlot(v),
        ...baseNodeProps(v),
      })),
    );
  }
  const body = {
    ...tsInterfaceBody(bodyElements),
    ...baseNodeProps(node.body),
  };

  return tsInterfaceDeclaration(node.id, typeParameters, _extends, body);
}
