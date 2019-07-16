import { Flow, isIdentifier, Program, TSTypeReference } from '@babel/types';
import { NodePath, Node } from '@babel/traverse';
import helperTypes from '../helper_types';
import { warnOnlyOnce } from '../util';

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
    // @ts-ignore recast support
    if (firstNode && firstNode.comments && firstNode.comments.length) {
      // @ts-ignore recast support
      const commentIndex = firstNode.comments.findIndex(item => item.value.trim() === '@flow');
      if (commentIndex !== -1) {
        // @ts-ignore recast support
        firstNode.comments.splice(commentIndex, 1);
      }
    }
  },
  exit(path: NodePath<Program>) {
    path.traverse({
      /* istanbul ignore next */
      Flow(path: NodePath<Flow>) {
        throw path.buildCodeFrameError('not converted flow node: ' + path.node.type);
      },
    });

    const usedHelperTypes = new Set<keyof typeof helperTypes>();
    path.traverse({
      TSTypeReference(typeReferencePath: NodePath<TSTypeReference>) {
        const node = typeReferencePath.node;
        if (isIdentifier(node.typeName)) {
          const name = node.typeName.name;
          if (name === '$Call') {
            if (node.typeParameters) {
              if (node.typeParameters.params.length === 1) {
                node.typeName.name = 'ReturnType';
              } else if (node.typeParameters.params.length === 2) {
                node.typeName.name = '$Call1';
                usedHelperTypes.add('$Call1');
              } else if (node.typeParameters.params.length === 3) {
                node.typeName.name = '$Call2';
                usedHelperTypes.add('$Call2');
              } else if (node.typeParameters.params.length === 4) {
                node.typeName.name = '$Call3';
                usedHelperTypes.add('$Call3');
              } else if (node.typeParameters.params.length === 5) {
                node.typeName.name = '$Call4';
                usedHelperTypes.add('$Call4');
              } else if (node.typeParameters.params.length === 6) {
                node.typeName.name = '$Call5';
                usedHelperTypes.add('$Call5');
              } else {
                warnOnlyOnce(
                  '$Call utility type is used with more then 6 type parameters - this is crazy, do not want to fix',
                );
              }
            }
          } else {
            // @ts-ignore
            if (helperTypes[name]) {
              // @ts-ignore
              usedHelperTypes.add(name);
            }
          }
        }
      },
    });

    const body = path.get('body');
    const imports = body.filter(st => st.isImportDeclaration());
    const after = imports.length > 0 ? imports[imports.length - 1] : body[0];

    usedHelperTypes.forEach(helperName => {
      after.insertAfter(helperTypes[helperName]);
    });
  },
};
