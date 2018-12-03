import {ImportDeclaration, ImportSpecifier} from '@babel/types';
import {NodePath} from '@babel/traverse';
import {convertImportDeclaration} from '../converters/convert_import_declaration';

export function ImportDeclaration(path: NodePath<ImportDeclaration>) {
    path.replaceWith(convertImportDeclaration(path));
}

export function ImportSpecifier(path: NodePath<ImportSpecifier>) {
    path.node.importKind = null
}
