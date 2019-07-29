import { DeclareClass } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertDeclareClass } from '../converters/convert_declare_class';
import { replaceWith } from '../utils/replaceWith';
import { PluginPass } from '../types';

declare module '@babel/types' {
  interface ObjectTypeProperty {
    method: boolean;
  }
}

export function DeclareClass(path: NodePath<DeclareClass>, state: PluginPass) {
  const decl = convertDeclareClass(path.node);
  decl.declare = !state.get('isModuleDeclaration');

  replaceWith(path, decl);
}
