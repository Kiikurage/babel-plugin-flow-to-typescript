import {TypeAnnotation} from '@babel/types';
import {NodePath} from '@babel/traverse';
import {convertTypeAnnotation} from '../converters/convert_type_annotation';

export function TypeAnnotation(path: NodePath<TypeAnnotation>) {
    path.replaceWith(convertTypeAnnotation(path));
}
