import { BaseNode } from '@babel/types';

export function recastProps(node: BaseNode): Partial<Omit<BaseNode, 'type'>> {
  return {
    // @ts-ignore comments for recast
    comments: node.comments,
  };
}
