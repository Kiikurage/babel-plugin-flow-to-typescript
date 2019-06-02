import { NodePath } from '@babel/traverse';
import { OpaqueType, tsTypeAliasDeclaration, TSTypeAliasDeclaration } from '@babel/types';
import { warnOnlyOnce } from '../util';
import { convertFlowType } from './convert_flow_type';

export function convertOpaqueType(path: NodePath<OpaqueType>): TSTypeAliasDeclaration {
  if (path.node.supertype)
    warnOnlyOnce('Subtyping constraints in opaque type in Flow is ignored in TypeScript');
  const tsNode = tsTypeAliasDeclaration(path.node.id, null, convertFlowType(path.get('impltype')));
  tsNode.declare = false;

  return tsNode;
}
