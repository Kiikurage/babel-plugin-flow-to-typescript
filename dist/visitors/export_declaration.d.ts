import { ExportNamedDeclaration, ExportDefaultDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';
export declare function ExportNamedDeclaration(path: NodePath<ExportNamedDeclaration>): void;
export declare function ExportDefaultDeclaration(path: NodePath<ExportDefaultDeclaration>): void;
