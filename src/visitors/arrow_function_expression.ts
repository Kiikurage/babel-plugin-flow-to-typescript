import { ArrowFunctionExpression, isTypeParameterDeclaration, tsAnyKeyword } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { transformFunctionParams } from '../transforms/transform_function_params';

export function ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
  transformFunctionParams(path.get('params'));

  if (isTypeParameterDeclaration(path.node.typeParameters)) {
    const tsTypeParameterDeclaration = convertTypeParameterDeclaration(path.node.typeParameters);
    // todo: isJSX config option
    // workaround for tsx files to differentiate type parameters from jsx
    tsTypeParameterDeclaration.params[0].constraint = tsAnyKeyword();
    path.get('typeParameters').replaceWith(tsTypeParameterDeclaration);
  }
}
