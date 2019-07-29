import { OpaqueType } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertOpaqueType } from '../converters/convert_opaque_type';
import { replaceWith } from '../utils/replaceWith';

export function OpaqueType(path: NodePath<OpaqueType>) {
  replaceWith(path, convertOpaqueType(path.node));
}
