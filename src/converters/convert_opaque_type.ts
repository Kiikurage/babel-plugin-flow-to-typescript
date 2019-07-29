import { OpaqueType, tsTypeAliasDeclaration, TSTypeAliasDeclaration } from '@babel/types';
import { warnOnlyOnce } from '../util';
import { convertFlowType } from './convert_flow_type';
import { baseNodeProps } from '../utils/baseNodeProps';

export function convertOpaqueType(node: OpaqueType): TSTypeAliasDeclaration {
  if (node.supertype) {
    warnOnlyOnce('Subtyping constraints in opaque type in Flow is ignored in TypeScript');
  }
  const tsNode = tsTypeAliasDeclaration(node.id, null, {
    ...convertFlowType(node.impltype),
    ...baseNodeProps(node.impltype),
  });
  tsNode.declare = false;

  return tsNode;
}
