import { ArrowFunctionExpression, isTypeParameterDeclaration, tsAnyKeyword } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { transformFunctionParams } from '../transforms/transform_function_params';
import { replaceWith } from '../utils/replaceWith';
import { PluginPass } from '../types';

export function ArrowFunctionExpression(
  path: NodePath<ArrowFunctionExpression>,
  state: PluginPass,
) {
  transformFunctionParams(path.get('params'));
  // @ts-ignore todo: add babel type
  path.get('predicate').remove();
  if (isTypeParameterDeclaration(path.node.typeParameters)) {
    const tsTypeParameterDeclaration = convertTypeParameterDeclaration(path.node.typeParameters);
    if (state.opts.isJSX) {
      // workaround for tsx files to differentiate type parameters from jsx
      tsTypeParameterDeclaration.params[0].constraint = tsAnyKeyword();
    }
    replaceWith(path.get('typeParameters'), tsTypeParameterDeclaration);
  }
}
