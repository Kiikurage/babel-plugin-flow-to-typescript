import { CallExpression } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeParameterInstantiation } from '../converters/convert_type_parameter_instantiation';

export function CallExpression(path: NodePath<CallExpression>) {
  if (path.node.typeArguments) {
    const typeParameters = convertTypeParameterInstantiation(path.node.typeArguments);
    path.node.typeArguments = null;
    path.get('typeParameters').replaceWith(typeParameters);
  }
}
