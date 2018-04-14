import {NodePath} from '@babel/traverse';
import {
    tsTypeAnnotation,
    TSTypeAnnotation,
    TypeAnnotation
} from '@babel/types';
import {convertFlowType} from './convert_flow_type';

export function convertTypeAnnotation(path: NodePath<TypeAnnotation>): TSTypeAnnotation {
    return tsTypeAnnotation(convertFlowType(path.get('typeAnnotation')));
}
