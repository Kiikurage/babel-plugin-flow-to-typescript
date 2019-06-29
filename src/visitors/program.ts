import { Flow, Program } from '@babel/types';
import { NodePath, Node } from '@babel/traverse';

export default {
  enter(path: NodePath<Program>) {
    const [firstNode] = path.node.body;

    if (firstNode && firstNode.leadingComments && firstNode.leadingComments.length) {
      const commentIndex = firstNode.leadingComments.findIndex(
        item => item.value.trim() === '@flow',
      );
      if (commentIndex !== -1) {
        (path.get(`body.0.leadingComments.${commentIndex}`) as NodePath<Node>).remove();
      }
    }
  },
  exit(path: NodePath<Program>) {
    path.traverse({
      Flow(path: NodePath<Flow>) {
        throw path.buildCodeFrameError('not converted flow node: ' + path.node.type);
      },
    });
  },
};
