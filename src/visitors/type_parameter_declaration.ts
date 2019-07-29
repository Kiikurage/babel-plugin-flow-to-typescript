import { TypeParameterDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { replaceWith } from '../utils/replaceWith';

export function TypeParameterDeclaration(path: NodePath<TypeParameterDeclaration>) {
  replaceWith(path, convertTypeParameterDeclaration(path.node));
}
