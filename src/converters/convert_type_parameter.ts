import { NodePath } from '@babel/traverse';
import { FlowType, TSTypeParameter, tsTypeParameter, TypeParameter } from '@babel/types';
import { convertFlowType } from './convert_flow_type';

export function convertTypeParameter(path: NodePath<TypeParameter>): TSTypeParameter {
  const tsNode = tsTypeParameter();

  if (path.node.bound) {
    tsNode.constraint = convertFlowType(path.get('bound.typeAnnotation') as NodePath<FlowType>);
  }
  tsNode.name = path.node.name;

  return tsNode;
}
