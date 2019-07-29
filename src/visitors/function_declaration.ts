import { FunctionDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { transformFunctionParams } from '../transforms/transform_function_params';

export function FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
  transformFunctionParams(path.get('params'));
  // @ts-ignore todo: add babel type
  path.get('predicate').remove();
}
