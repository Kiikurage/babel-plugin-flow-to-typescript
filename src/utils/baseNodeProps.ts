import { BaseNode } from '@babel/types';

export function baseNodeProps(node: BaseNode): Omit<BaseNode, 'type'> {
  return {
    leadingComments: node.leadingComments,
    innerComments: node.innerComments,
    trailingComments: node.trailingComments,
    start: null,
    end: null,
    loc: node.loc,
  };
}
