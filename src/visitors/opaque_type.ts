import {OpaqueType} from '@babel/types';
import {NodePath} from '@babel/traverse';
import {convertOpaqueType} from '../converters/convert_opaque_type';

export function OpaqueType(path: NodePath<OpaqueType>) {
    path.replaceWith(convertOpaqueType(path));
}
