import { NodePath } from '@babel/traverse';
import { OpaqueType, TSTypeAliasDeclaration } from '@babel/types';
export declare function convertOpaqueType(path: NodePath<OpaqueType>): TSTypeAliasDeclaration;
