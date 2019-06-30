import {
  DeclareVariable,
  isTypeAnnotation,
  tsTypeAnnotation,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';

export function convertDeclareVariable(node: DeclareVariable) {
  const id = node.id;
  if (isTypeAnnotation(id.typeAnnotation)) {
    id.typeAnnotation = {
      ...tsTypeAnnotation(convertFlowType(id.typeAnnotation.typeAnnotation)),
      ...baseNodeProps(id.typeAnnotation),
    };
  }
  return variableDeclaration('var', [variableDeclarator(id)]);
}
