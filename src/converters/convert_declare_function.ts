import {
  FlowType,
  FunctionTypeParam,
  FunctionTypeAnnotation,
  DeclareFunction,
  tsDeclareFunction,
  tsTypeAnnotation,
  identifier,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertFlowType } from './convert_flow_type';

export function convertDeclareFunction(path: NodePath<DeclareFunction>) {
  const nodePath = path.get('id.typeAnnotation.typeAnnotation') as NodePath<FunctionTypeAnnotation>;
  const identifiers = nodePath.node.params.map((p, i) => {
    const name = (p.name && p.name.name) || `x${i}`;
    const ftParam = nodePath.get(`params.${i}`) as NodePath<FunctionTypeParam>;
    const typeAnn = ftParam.get('typeAnnotation') as NodePath<FlowType>;

    const iden = identifier(name);
    iden.typeAnnotation = tsTypeAnnotation(convertFlowType(typeAnn));
    return iden;
  });
  const returnType = tsTypeAnnotation(convertFlowType(nodePath.get('returnType')));

  return tsDeclareFunction(path.node.id, null, identifiers, returnType);
}
