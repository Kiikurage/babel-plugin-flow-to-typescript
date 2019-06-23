import { importDeclaration, ImportDeclaration } from '@babel/types';

export function convertImportDeclaration(node: ImportDeclaration): ImportDeclaration {
  if (node.importKind === null) return node;

  const ret = importDeclaration(node.specifiers, node.source);
  ret.importKind = null;

  return ret;
}
