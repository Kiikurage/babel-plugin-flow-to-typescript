import { DeclareTypeAlias, tsTypeAliasDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertTypeParameterDeclaration } from '../converters/convert_type_parameter_declaration';
import { convertFlowType } from '../converters/convert_flow_type';

export function DeclareTypeAlias(path: NodePath<DeclareTypeAlias>) {
  const node = path.node;
  let tp = null;
  if (node.typeParameters) {
    tp = convertTypeParameterDeclaration(node.typeParameters);
  }
  const t = convertFlowType(node.right);
  const replacement = tsTypeAliasDeclaration(path.node.id, tp, t);
  replacement.declare = true;
  path.replaceWith(replacement);
}
