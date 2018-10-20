import {NodePath} from '@babel/traverse';
import {
    ExportDeclaration,
} from '@babel/types';

export function convertEmportDeclaration(path: NodePath<ExportDeclaration>): ExportDeclaration {
    if ((path.node as any).exportKind === null) return path.node;
    (path.node as any).exportKind = null;
    return path.node;
}
