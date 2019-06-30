import {
  isObjectTypeProperty,
  tsInterfaceDeclaration,
  tsInterfaceBody,
  tsTypeParameterInstantiation,
  tsExpressionWithTypeArguments,
  Identifier,
  ClassImplements,
  InterfaceExtends,
  InterfaceDeclaration,
  TSExpressionWithTypeArguments,
} from '@babel/types';

import { convertFlowType } from './convert_flow_type';
import { convertTypeParameterDeclaration } from './convert_type_parameter_declaration';
import { convertObjectTypeProperty } from './convert_object_type_property';

export function convertInterfaceExtends(node: InterfaceExtends | ClassImplements) {
  const typeParameters = node.typeParameters;
  const typeParameterParams = typeParameters ? typeParameters.params : [];
  const parameters = tsTypeParameterInstantiation(
    typeParameterParams.map(item => convertFlowType(item)),
  );

  return tsExpressionWithTypeArguments(
    node.id as Identifier,
    typeParameterParams.length ? parameters : null,
  );
}

export function convertInterfaceDeclaration(node: InterfaceDeclaration) {
  const origBody = node.body;
  const origExtends = node.extends;
  const origImplements = node.implements;
  const origTypeParameters = node.typeParameters;

  let origExtendsCombined: Array<InterfaceExtends | ClassImplements> = [];
  if (Array.isArray(origExtends)) {
    origExtendsCombined = origExtendsCombined.concat(origExtends);
  }
  if (Array.isArray(origImplements)) {
    origExtendsCombined = origExtendsCombined.concat(origImplements);
  }

  const typeParameters = origTypeParameters
    ? convertTypeParameterDeclaration(origTypeParameters)
    : null;

  const members = [];
  for (const property of origBody.properties) {
    if (isObjectTypeProperty(property)) {
      members.push(convertObjectTypeProperty(property));
    }
  }

  const extending: Array<TSExpressionWithTypeArguments> = origExtendsCombined.map(origExtend =>
    convertInterfaceExtends(origExtend),
  );

  return tsInterfaceDeclaration(
    node.id,
    typeParameters,
    extending.length ? extending : null,
    tsInterfaceBody(members),
  );
}
