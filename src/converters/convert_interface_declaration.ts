import {
  isObjectTypeProperty,
  tsInterfaceDeclaration,
  tsInterfaceBody,
  tsTypeAnnotation,
  tsPropertySignature,
  tsTypeParameterInstantiation,
  tsExpressionWithTypeArguments,
  FlowType,
  Identifier,
  TSTypeElement,
  ClassImplements,
  InterfaceExtends,
  InterfaceDeclaration,
  TypeParameterDeclaration,
  TSExpressionWithTypeArguments,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertFlowType } from '../converters/convert_flow_type';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';

export function convertInterfaceExtends(path: NodePath<InterfaceExtends | ClassImplements>) {
  const pathTypeParameters = path.get('typeParameters') as any;
  const pathTypeParameterParams: NodePath<FlowType>[] = pathTypeParameters.node
    ? pathTypeParameters.get('params')
    : [];
  const parameters = tsTypeParameterInstantiation(
    pathTypeParameterParams.map(item => convertFlowType(item)),
  );

  return tsExpressionWithTypeArguments(
    path.node.id as Identifier,
    pathTypeParameterParams.length ? parameters : null,
  );
}

export function convertInterfaceDeclaration(path: NodePath<InterfaceDeclaration>) {
  const origBody = path.get('body');
  const origExtends: NodePath<InterfaceExtends>[] = path.get('extends') as any;
  const origImplements: NodePath<ClassImplements>[] = path.get('implements') as any;
  const origTypeParameters = path.get('typeParameters');

  let origExtendsCombined: Array<NodePath<InterfaceExtends | ClassImplements>> = [];
  if (Array.isArray(origExtends)) {
    origExtendsCombined = origExtendsCombined.concat(origExtends);
  }
  if (Array.isArray(origImplements)) {
    origExtendsCombined = origExtendsCombined.concat(origImplements);
  }

  const typeParameters = origTypeParameters.node
    ? convertTypeParameterDeclaration(origTypeParameters as NodePath<TypeParameterDeclaration>)
    : null;

  const members: Array<TSTypeElement> = [];

  origBody.node.properties.forEach((property, i) => {
    if (isObjectTypeProperty(property)) {
      const tsPropSignature = tsPropertySignature(
        property.key,
        tsTypeAnnotation(
          convertFlowType(origBody.get(`properties.${i}.value`) as NodePath<FlowType>),
        ),
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
    path.node.id,
    typeParameters,
    extending.length ? extending : null,
    tsInterfaceBody(members),
  );
}
