import { TypeAnnotation, TypeAlias } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeAnnotation, convertTypeAlias } from '../converters/convert_type_annotation';

export function TypeAnnotation(path: NodePath<TypeAnnotation>) {
  path.replaceWith(convertTypeAnnotation(path));
}
export function TypeAlias(path: NodePath<TypeAlias>) {
  path.replaceWith(convertTypeAlias(path));
}
