import {
  isObjectTypeProperty,
  tsInterfaceDeclaration,
  tsInterfaceBody,
  tsTypeAnnotation,
  tsPropertySignature,
  InterfaceDeclaration,
  TypeParameterDeclaration,
  TSTypeElement,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertFlowType } from '../converters/convert_flow_type';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';

export function convert_interface_declaration(path: NodePath<InterfaceDeclaration>) {
  const origBody = path.get('body');
  const origTypeParameters = path.get('typeParameters');

  const typeParameters = origTypeParameters.node
    ? convertTypeParameterDeclaration(origTypeParameters as NodePath<TypeParameterDeclaration>)
    : null;

  const members: Array<TSTypeElement> = [];

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

  return tsInterfaceDeclaration(path.node.id, typeParameters, null, tsInterfaceBody(members));
}
