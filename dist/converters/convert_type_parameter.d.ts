import { NodePath } from '@babel/traverse';
import { TSTypeParameter, TypeParameter } from '@babel/types';
export declare function convertTypeParameter(path: NodePath<TypeParameter>): TSTypeParameter;
