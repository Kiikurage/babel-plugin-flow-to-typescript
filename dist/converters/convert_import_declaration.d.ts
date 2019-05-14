import { NodePath } from '@babel/traverse';
import { ImportDeclaration } from '@babel/types';
export declare function convertImportDeclaration(path: NodePath<ImportDeclaration>): ImportDeclaration;
