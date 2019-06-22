import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

const onlyOnceFlagSet = new Set<string | number | boolean>();

export function warnOnlyOnce(key: string | number | boolean, message?: string) {
  if (!message) message = String(key);

  if (onlyOnceFlagSet.has(key)) return;
  onlyOnceFlagSet.add(key);
  console.warn(message);
}

//tslint:disable:no-any
export function isNodePath<T extends t.BaseNode>(
  fn: (node: object, ...args: any[]) => node is T,
  path: NodePath<t.BaseNode>,
): path is NodePath<T> {
  return fn(path.node);
}

export class UnsupportedError extends Error {}

// https://github.com/bcherny/flow-to-typescript/blob/f1dbe3d1f97b97d655ea6c5f1f5caaaa9f1e0c9f/src/utils.ts
const candidates = 'abcdefghijklmnopqrstuvwxyz'.split('');
export function generateFreeIdentifier(usedIdentifiers: string[]) {
  return candidates.find(_ => usedIdentifiers.indexOf(_) < 0)!;
}

UnsupportedError.prototype.name = UnsupportedError.name;
