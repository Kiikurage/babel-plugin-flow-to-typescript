import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export declare function warnOnlyOnce(key: string | number | boolean, message?: string): void;
export declare function isNodePath<T extends t.BaseNode>(fn: (node: object, ...args: any[]) => node is T, path: NodePath<t.BaseNode>): path is NodePath<T>;
export declare class UnsupportedError extends Error {
}
