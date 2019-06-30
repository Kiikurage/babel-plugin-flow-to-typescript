import {
  clone,
  DeclareInterface,
  isObjectTypeProperty,
  tsInterfaceBody,
  tsInterfaceDeclaration,
} from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { baseNodeProps } from '../utils/baseNodeProps';
import { convertInterfaceExtends } from '../converters/convert_interface_declaration';
import { convertObjectTypeProperty } from '../converters/convert_object_type_property';
import { convertObjectTypeCallProperty } from '../converters/convert_object_type_call_property';
import { convertObjectTypeIndexer } from '../converters/convert_object_type_indexer';
import { convertObjectTypeInternalSlot } from '../converters/convert_object_type_internal_slot';

export function DeclareInterface(path: NodePath<DeclareInterface>) {
  const node = path.node;
  const id = clone(node.id);
  let tp = null;
  if (node.typeParameters) {
    tp = {
      ...convertTypeParameterDeclaration(node.typeParameters),
      ...baseNodeProps(node.typeParameters),
    };
  }
  let ext = undefined;
  if (node.extends && node.extends.length > 0) {
    ext = node.extends.map(convertInterfaceExtends);
  }
  const bodyElements = [];
  for (const property of node.body.properties) {
    if (isObjectTypeProperty(property)) {
      bodyElements.push(convertObjectTypeProperty(property));
    }
  }
  if (node.body.callProperties) {
    bodyElements.push(...node.body.callProperties.map(convertObjectTypeCallProperty));
  }
  if (node.body.indexers) {
    bodyElements.push(...node.body.indexers.map(convertObjectTypeIndexer));
  }
  if (node.body.internalSlots) {
    bodyElements.push(...node.body.internalSlots.map(convertObjectTypeInternalSlot));
  }

  const body = tsInterfaceBody(bodyElements);

  const replacement = tsInterfaceDeclaration(id, tp, ext, body);
  replacement.declare = true;
  path.replaceWith(replacement);
}
