import { NodePath } from '@babel/traverse';
import { TSTypeParameterDeclaration, TypeParameterDeclaration } from '@babel/types';
export declare function convertTypeParameterDeclaration(path: NodePath<TypeParameterDeclaration>): TSTypeParameterDeclaration;
