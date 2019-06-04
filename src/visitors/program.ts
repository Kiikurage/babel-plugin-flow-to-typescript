import { Program as ProgramDecl } from '@babel/types';
import { NodePath } from '@babel/traverse';

export function Program(path: NodePath<ProgramDecl>) {
  const [firstNode] = path.node.body;

  if (firstNode && firstNode.leadingComments && firstNode.leadingComments.length) {
    const commentIndex = firstNode.leadingComments.findIndex(item => item.value.trim() === '@flow');
    if (commentIndex !== -1) {
      path.get(`body.0.leadingComments.${commentIndex}`).remove();
    }
  }
}
