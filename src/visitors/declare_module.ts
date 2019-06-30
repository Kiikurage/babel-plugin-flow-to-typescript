import { NodePath } from '@babel/traverse';
import { DeclareModule, tsModuleBlock, tsModuleDeclaration } from '@babel/types';
import { baseNodeProps } from '../utils/baseNodeProps';

export function DeclareModule(path: NodePath<DeclareModule>) {
  const node = path.node;

  const moduleBlock = {
    ...tsModuleBlock(node.body.body),
    ...baseNodeProps(node.body),
  };

  const replacement = tsModuleDeclaration(node.id, moduleBlock);
  replacement.declare = true;
  path.replaceWith(replacement);
}
