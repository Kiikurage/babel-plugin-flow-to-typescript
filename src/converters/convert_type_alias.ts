import {NodePath} from '@babel/traverse';
import {
    tsTypeAliasDeclaration,
    TSTypeAliasDeclaration,
    TypeAlias,
} from '@babel/types';
import {convertFlowType} from './convert_flow_type';

export function convertTypeAlias(path: NodePath<TypeAlias>): TSTypeAliasDeclaration {
    const tsNode = tsTypeAliasDeclaration(
        path.node.id, null, convertFlowType(path.get('right'))
    );
    tsNode.declare = false;

    return tsNode;
}
