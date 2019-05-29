import {NodePath} from '@babel/traverse';
import {
    tsTypeAnnotation,
    tsTypeAliasDeclaration,
    TSTypeAnnotation,
    TSTypeAliasDeclaration,
    TypeAnnotation,
    TypeAlias,
} from '@babel/types';
import {convertFlowType} from './convert_flow_type';
import {convertTypeParameterDeclaration} from './convert_type_parameter_declaration';

export function convertTypeAnnotation(path: NodePath<TypeAnnotation>): TSTypeAnnotation {
    return tsTypeAnnotation(convertFlowType(path.get('typeAnnotation')));
}
export function convertTypeAlias(path: NodePath<TypeAlias>): TSTypeAliasDeclaration {
    const typeParameters = path.get('typeParameters');
    const right = path.get('right');
    return tsTypeAliasDeclaration(
        path.node.id,
        typeParameters.isTypeParameterDeclaration()
            ? convertTypeParameterDeclaration(typeParameters)
            : null,
        convertFlowType(right)
    );
}
