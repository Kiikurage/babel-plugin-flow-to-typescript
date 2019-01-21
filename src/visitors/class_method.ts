import {ClassMethod} from '@babel/types';
import {NodePath} from '@babel/traverse';
import {convertClassConstructor} from '../converters/convert_class_constructor';

export function ClassMethod(path: NodePath<ClassMethod>) {
  if (path.node.kind === 'constructor') {
      path.replaceWith(convertClassConstructor(path));
  }
}
