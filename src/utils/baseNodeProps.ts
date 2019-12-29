import { Node } from '@babel/types';
import { recastProps } from './recastProps';

export function baseNodeProps(node: Node): Omit<Node, 'type'> {
  return {
    leadingComments: node.leadingComments,
    innerComments: node.innerComments,
    trailingComments: node.trailingComments,
    start: null,
    end: null,
    loc: node.loc,
    ...recastProps(node),
  };
}
