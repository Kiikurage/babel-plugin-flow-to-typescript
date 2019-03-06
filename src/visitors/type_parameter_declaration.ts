import {TypeParameterDeclaration} from '@babel/types';
import {NodePath} from '@babel/traverse';
import {convertTypeParameterDeclaration} from '../converters/convert_type_parameter_declaration';

export function TypeParameterDeclaration(path: NodePath<TypeParameterDeclaration>) {
    path.replaceWith(convertTypeParameterDeclaration(path));
}
