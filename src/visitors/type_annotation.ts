import { TypeAnnotation } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeAnnotation } from '../converters/convert_type_annotation';
import { replaceWith } from '../utils/replaceWith';

export function TypeAnnotation(path: NodePath<TypeAnnotation>) {
  replaceWith(path, convertTypeAnnotation(path.node));
}
