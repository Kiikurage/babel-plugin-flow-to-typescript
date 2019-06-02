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

export function convert_interface_declaration(path: NodePath<InterfaceDeclaration>) {
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
  const extending: Array<TSExpressionWithTypeArguments> = [];

  origBody.node.properties.forEach((property, i) => {
    if (isObjectTypeProperty(property)) {
      const tsPropSignature = tsPropertySignature(
        property.key,
        tsTypeAnnotation(convertFlowType(origBody.get(`properties.${i}`).get('value'))),
      );
      tsPropSignature.optional = property.optional;
      tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
      members.push(tsPropSignature);
    }
  });

  origExtendsCombined.forEach(origExtend => {
    const origExtendTypeParameters: NodePath<FlowType>[] = origExtend
      .get('typeParameters')
      .get('params') as any;
    const parameters = tsTypeParameterInstantiation(
      origExtendTypeParameters.map(item => convertFlowType(item)),
    );

    extending.push(tsExpressionWithTypeArguments(origExtend.node.id as Identifier, parameters));
  });

  return tsInterfaceDeclaration(path.node.id, typeParameters, extending, tsInterfaceBody(members));
}
