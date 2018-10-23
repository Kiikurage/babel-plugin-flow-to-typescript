import {NodePath} from '@babel/traverse';
import {
    ExportDeclaration,
} from '@babel/types';

export function convertEmportDeclaration(path: NodePath<ExportDeclaration>): ExportDeclaration {
    (path.node as any).exportKind = null;
    return path.node;
}
