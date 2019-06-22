import {NodePath} from '@babel/traverse';
import {
    importDeclaration,
    ImportDeclaration,
} from '@babel/types';

export function convertImportDeclaration(path: NodePath<ImportDeclaration>): ImportDeclaration {
    if (path.node.importKind === null) return path.node;

    const ret = importDeclaration(path.node.specifiers, path.node.source);
    ret.importKind = null;

    return ret;
}
