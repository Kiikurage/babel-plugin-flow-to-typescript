import { NodePath, Node } from '@babel/traverse';

// tslint:disable-next-line:no-any
export function replaceWith(path: NodePath<any>, replacement: Node | NodePath<any>) {
  if (replacement instanceof NodePath) {
    replacement = replacement.node;
  }
  path.replaceWith({
    ...replacement,
    // @ts-ignore
    comments: path.node ? path.node.comments : undefined,
  } as Node);
}
