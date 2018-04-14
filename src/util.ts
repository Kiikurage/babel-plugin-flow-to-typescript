import {NodePath} from '@babel/traverse';
import * as t from '@babel/types';

const onlyOnceFlagSet = new Set<string | number | boolean>();

export function warnOnlyOnce(key: string | number | boolean, message?: string) {
    if (!message) message = String(key);

    if (onlyOnceFlagSet.has(key)) return;
    onlyOnceFlagSet.add(key);
    console.warn(message);
}

//tslint:disable:no-any
export function isNodePath<T extends t.BaseNode>(fn: (node: object, ...args: any[]) => node is T, path: NodePath<t.BaseNode>): path is NodePath<T> {
    return fn(path.node);
}

export class UnsupportedError extends Error {
}

UnsupportedError.prototype.name = UnsupportedError.name;