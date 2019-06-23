import { TSTypeParameter, tsTypeParameter, TypeParameter } from '@babel/types';
import { convertFlowType } from './convert_flow_type';

export function convertTypeParameter(node: TypeParameter): TSTypeParameter {
  const tsNode = tsTypeParameter();

  if (node.bound) {
    tsNode.constraint = convertFlowType(node.bound.typeAnnotation);
  }
  tsNode.name = node.name;

  return tsNode;
}
