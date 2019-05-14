import { ImportDeclaration, ImportSpecifier } from '@babel/types';
import { NodePath } from '@babel/traverse';
export declare function ImportDeclaration(path: NodePath<ImportDeclaration>): void;
export declare function ImportSpecifier(path: NodePath<ImportSpecifier>): void;
