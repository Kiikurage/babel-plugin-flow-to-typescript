import { NodePath } from '@babel/traverse';
import {
  DeclareModule,
  isIdentifier,
  stringLiteral,
  tsModuleBlock,
  tsModuleDeclaration,
} from '@babel/types';
import { baseNodeProps } from '../utils/baseNodeProps';
import { replaceWith } from '../utils/replaceWith';
import { PluginPass } from '../types';

export default {
  enter(path: NodePath<DeclareModule>, state: PluginPass) {
    state.set('isModuleDeclaration', true);
    const node = path.node;

    const moduleBlock = {
      ...tsModuleBlock(node.body.body),
      ...baseNodeProps(node.body),
    };

    let id = node.id;
    if (isIdentifier(node.id)) {
      // it is not documented, but looking at lib/react.js in flow sources
      // it looks - "declare module react {}" should be identical to "declare module 'react' {}"
      id = stringLiteral(node.id.name);
    }
    const replacement = tsModuleDeclaration(id, moduleBlock);
    replacement.declare = true;
    replaceWith(path, replacement);
  },
  exit(_: NodePath<DeclareModule>, state: PluginPass) {
    state.set('isModuleDeclaration', false);
  },
};
