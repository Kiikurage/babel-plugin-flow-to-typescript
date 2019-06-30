import { DeclareTypeAlias, tsTypeAliasDeclaration, TypeAlias } from '@babel/types';
import { convertTypeParameterDeclaration } from './convert_type_parameter_declaration';
import { convertFlowType } from './convert_flow_type';

export function convertDeclareTypeAlias(node: DeclareTypeAlias | TypeAlias) {
  let tp = null;
  if (node.typeParameters) {
    tp = convertTypeParameterDeclaration(node.typeParameters);
  }
  const t = convertFlowType(node.right);
  return tsTypeAliasDeclaration(node.id, tp, t);
}
