import { NodePath } from '@babel/traverse';
import { TSModuleDeclaration } from '@babel/types';
import { PluginPass } from '../types';

export default {
  enter(_path: NodePath<TSModuleDeclaration>, state: PluginPass) {
    state.set('isModuleDeclaration', true);
  },
  exit(_: NodePath<TSModuleDeclaration>, state: PluginPass) {
    state.set('isModuleDeclaration', false);
  },
};
