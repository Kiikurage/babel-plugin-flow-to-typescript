import { NodePath } from '@babel/traverse';
import { TSTypeAnnotation, TSTypeAliasDeclaration, TypeAnnotation, TypeAlias } from '@babel/types';
export declare function convertTypeAnnotation(path: NodePath<TypeAnnotation>): TSTypeAnnotation;
export declare function convertTypeAlias(path: NodePath<TypeAlias>): TSTypeAliasDeclaration;
