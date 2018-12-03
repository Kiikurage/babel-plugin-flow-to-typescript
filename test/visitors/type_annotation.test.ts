import * as pluginTester from 'babel-plugin-tester';
import {buildPlugin} from '../../src/plugin';
import {TypeAnnotation} from '../../src/visitors/type_annotation';

pluginTester({
    plugin: buildPlugin([TypeAnnotation]),
    tests: [{
        title: 'Any type',
        code: `let a: any;`,
        output: `let a: any;`
    }, {
        title: 'Array type',
        code: `let a: Array<any>;`,
        output: `let a: Array<any>;`
    }, {
        title: 'Array type with shorthand syntax',
        code: `let a: any[];`,
        output: `let a: any[];`
    }, {
        title: 'Boolean keyword',
        code: `let a: boolean;`,
        output: `let a: boolean;`
    }, {
        title: 'Boolean literal',
        code: `let a: true;`,
        output: `let a: true;`
    }, {
        title: 'Null literal',
        code: `let a: null;`,
        output: `let a: null;`,
    }, {
        title: 'Empty type',
        code: `let a: empty;`,
        output: `let a: never;`,
    }, {
        title: 'Generic type',
        code: `let a: X<T>;`,
        output: `let a: X<T>;`
    }, {
        title: 'Utility generics: $Keys',
        code: `let a: $Keys<X>;`,
        output: `let a: keyof X;`
    }, {
        title: 'Utility generics: $Values',
        code: `let a: $Values<X>;`,
        output: `let a: X[keyof X];`
    }, {
        title: 'Utility generics: $ReadOnly',
        code: `let a: $ReadOnly<X>;`,
        output: `let a: Readonly<X>;`
    }, {
        title: 'Utility generics: $ReadOnlyArray',
        code: `let a: $ReadOnlyArray<X>;`,
        output: `let a: ReadonlyArray<X>;`
    }, {
        title: 'Utility generics: $Exact',
        code: `let a: $Exact<X>;`,
        output: `let a: X;`
    }, {
        title: 'Utility generics: $Diff',
        code: `let a: $Diff<X, Y>;`,
        output: `let a: Pick<X, Exclude<keyof X, keyof Y>>;`
    }, {
        title: 'Utility generics: $PropertyType',
        code: `let a: $PropertyType<T, k>;`,
        output: `let a: T[k];`
    }, {
        title: 'Utility generics: $ElementType',
        code: `let a: $ElementType<T, k>;`,
        output: `let a: T[k];`
    }, {
        title: 'Intersection type',
        code: `let a: {x: number} & {y: string};`,
        output: `let a: {
  x: number;
} & {
  y: string;
};`
    }, {
        title: 'Type literal: indexer',
        code: `let a: {
  [x:string]: number;
  [x:number]: boolean;
};`,
        output: `let a: {
  [x: string]: number;
  [x: number]: boolean;
};`
    }, {
        title: 'Type literal: indexer without key name',
        code: `let a: {
  [string]: number;
  [number]: boolean;
};`,
        output: `let a: {
  [x: string]: number;
  [x: number]: boolean;
};`
    }, {
        title: 'Type literal: type literal with variance',
        code: `let a: { +b: string, -c:number };`,
        output: `let a: {
  readonly b: string;
  c: number;
};`,
    }, {
        title: 'Type literal: type literal with spread operator',
        code: `let a: { b: string, ...T };`,
        output: `let a: {
  b: string;
} | T;`,
    }, {
        title: 'Type literal: deep type literal with spread operator',
        code: `let a: { b: { c: T, ...U} };`,
        output: `let a: {
  b: {
    c: T;
  } | U;
};`,
    }, {
        title: 'Maybe type: variable declaration',
        code: `let a: ?string;`,
        output: `let a: string | undefined | null;`,
    }, {
        title: 'Maybe type: type literal',
        code: `let a: { x: ?string };`,
        output: `let a: {
  x: string | undefined | null;
};`,
    }, {
        title: 'Maybe type: type literal with optional key',
        code: `let a: { x?: ?string };`,
        output: `let a: {
  x?: string | null;
};`,
    }, {
        title: 'Maybe type: required parameter in function declaration',
        code: `function f(arg: ?string) {}`,
        output: `function f(arg: string | undefined | null) {}`,
    }, {
        title: 'Maybe type: optional parameter in function declaration',
        code: `function f(arg?: ?string) {}`,
        output: `function f(arg?: string | null) {}`,
    }, {
        title: 'Maybe type: generic type instantiation',
        code: `let a: X<?T>;`,
        output: `let a: X<T | undefined | null>;`,
    }, {
        title: 'Union type',
        code: `let a: string | number | boolean;`,
        output: `let a: string | number | boolean;`,
    }, {
        title: 'Void literal',
        code: `let a: void;`,
        output: `let a: void;`,
    }, {
        title: 'Tuple type',
        code: `let a: [number, string, Array<boolean>];`,
        output: `let a: [number, string, Array<boolean>];`,
    }]
});
