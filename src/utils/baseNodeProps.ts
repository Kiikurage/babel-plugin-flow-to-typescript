import { BaseNode } from '@babel/types';

export function baseNodeProps(node?: BaseNode): Omit<BaseNode, 'type'> {
  return {
    leadingComments: node ? node.leadingComments : null,
    innerComments: node ? node.innerComments : null,
    trailingComments: node ? node.trailingComments : null,
    start: null,
    end: null,
    loc: node ? node.loc : null,
  };
}
