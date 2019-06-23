import { TypeAnnotation, TypeAlias, NullableTypeAnnotation } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeAnnotation, convertTypeAlias } from '../converters/convert_type_annotation';
import { convertFlowType } from '../converters/convert_flow_type';

export function TypeAnnotation(path: NodePath<TypeAnnotation>) {
  path.replaceWith(convertTypeAnnotation(path.node));
}
export function TypeAlias(path: NodePath<TypeAlias>) {
  path.replaceWith(convertTypeAlias(path.node));
}
export function NullableTypeAnnotation(path: NodePath<NullableTypeAnnotation>) {
  path.replaceWith(convertFlowType(path.node));
}
