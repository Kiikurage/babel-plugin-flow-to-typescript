import {
  isObjectTypeProperty,
  tsInterfaceDeclaration,
  tsInterfaceBody,
  tsTypeAnnotation,
  tsPropertySignature,
  tsTypeParameterInstantiation,
  tsExpressionWithTypeArguments,
  Identifier,
  TSTypeElement,
  ClassImplements,
  InterfaceExtends,
  InterfaceDeclaration,
  TSExpressionWithTypeArguments,
} from '@babel/types';

import { convertFlowType } from './convert_flow_type';
import { convertTypeParameterDeclaration } from './convert_type_parameter_declaration';

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

  const members: Array<TSTypeElement> = [];

  origBody.properties.forEach(property => {
    if (isObjectTypeProperty(property)) {
      const tsPropSignature = tsPropertySignature(
        property.key,
        tsTypeAnnotation(convertFlowType(property.value)),
      );
      tsPropSignature.optional = property.optional;
      tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
      members.push(tsPropSignature);
    }
  });

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
