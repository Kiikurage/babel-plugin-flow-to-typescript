import {
  clone,
  DeclareVariable,
  isTypeAnnotation,
  tsTypeAnnotation,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertFlowType } from '../converters/convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';

export function DeclareVariable(path: NodePath<DeclareVariable>) {
  const id = clone(path.node.id);
  if (isTypeAnnotation(id.typeAnnotation)) {
    id.typeAnnotation = {
      ...tsTypeAnnotation(convertFlowType(id.typeAnnotation.typeAnnotation)),
      ...baseNodeProps(id.typeAnnotation),
    };
  }
  const replacement = variableDeclaration('var', [variableDeclarator(id)]);
  replacement.declare = true;
  path.replaceWith(replacement);
}
