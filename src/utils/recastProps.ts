import { Node } from '@babel/types';

export function recastProps(node: Node): Partial<Omit<Node, 'type'>> {
  return {
    // @ts-ignore comments for recast
    comments: node.comments,
  };
}
