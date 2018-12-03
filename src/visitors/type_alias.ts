import {TypeAlias} from '@babel/types';
import {NodePath} from '@babel/traverse';
import {convertTypeAlias} from '../converters/convert_type_alias';

export function TypeAlias(path: NodePath<TypeAlias>) {
    path.replaceWith(convertTypeAlias(path));
}
