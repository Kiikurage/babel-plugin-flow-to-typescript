import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'Any type',
      code: `let a: any;`,
      output: `let a: any;`,
    },
    {
      title: 'Array type',
      code: `let a: Array<any>;`,
      output: `let a: Array<any>;`,
    },
    {
      title: 'Array type with shorthand syntax',
      code: `let a: any[];`,
      output: `let a: any[];`,
    },
    {
      title: 'Boolean keyword',
      code: `let a: boolean;`,
      output: `let a: boolean;`,
    },
    {
      title: 'Boolean literal',
      code: `let a: true;`,
      output: `let a: true;`,
    },
    {
      title: 'numerical literal',
      code: `let a: 42;`,
      output: `let a: 42;`,
    },
    {
      title: 'string literal',
      code: `let a: "42";`,
      output: `let a: "42";`,
    },
    {
      title: 'Mixed type',
      code: `let a: mixed;`,
      output: `let a: unknown;`,
    },
    {
      title: 'Null literal',
      code: `let a: null;`,
      output: `let a: null;`,
    },
    {
      title: 'Empty type',
      code: `let a: empty;`,
      output: `let a: never;`,
    },
    {
      title: 'typeof keyword',
      code: `let a: typeof A;`,
      output: `let a: typeof A;`,
    },
    {
      title: 'Generic type',
      code: `let a: X<T>;`,
      output: `let a: X<T>;`,
    },
    {
      title: 'Utility generics: $Keys',
      code: `let a: $Keys<X>;`,
      output: `let a: keyof X;`,
    },
    {
      title: 'Utility generics: $Keys with typeof',
      code: `let a: $Keys<typeof X>;`,
      output: `let a: keyof typeof X;`,
    },
    {
      title: 'Utility generics: $Values',
      code: `let a: $Values<X>;`,
      output: `let a: X[keyof X];`,
    },
    {
      title: 'Utility generics: $ReadOnly',
      code: `let a: $ReadOnly<X>;`,
      output: `let a: Readonly<X>;`,
    },
    {
      title: 'Utility generics: $ReadOnlyArray',
      code: `let a: $ReadOnlyArray<X>;`,
      output: `let a: ReadonlyArray<X>;`,
    },
    {
      title: 'Utility generics: $Exact',
      code: `let a: $Exact<X>;`,
      output: `let a: X;`,
    },
    {
      title: 'Utility generics: $Diff',
      code: `let a: $Diff<X, Y>;`,
      output: `let a: Omit<X, keyof Y>;`,
    },
    {
      title: 'Utility generics: $Diff when keys from type literal can be computed on compile time',
      code: `let a: $Diff<X, {a:number, 'b':B, c():void }>;`,
      output: `let a: Omit<X, "a" | "b" | "c">;`,
    },
    {
      title:
        'Utility generics: $Diff when keys from type literal can not be computed on compile time',
      code: `let a: $Diff<X, {[k:string]:B}>;`,
      output: `let a: Omit<X, keyof {
  [k: string]: B;
}>;`,
    },
    {
      title: 'Utility generics: $PropertyType',
      code: `let a: $PropertyType<T, k>;`,
      output: `let a: T[k];`,
    },
    {
      title: 'Utility generics: $ElementType',
      code: `let a: $ElementType<T, k>;`,
      output: `let a: T[k];`,
    },
    {
      title: 'Utility generics: $Shape',
      code: `let a: $Shape<X>;`,
      output: `let a: Partial<X>;`,
    },
    // todo: implement more sophisticated logic to distinguish this from general case implemented by helper type
    // {
    //   title: 'Utility generics: Class',
    //   code: `let a: Class<X>;`,
    //   output: `let a: typeof X;`,
    // },
    {
      title: 'Object type: exact=true',
      code: `let a: {| a: T |};`,
      output: `let a: {
  a: T;
};`,
    },
    {
      title: 'Intersection type',
      code: `let a: {x: number} & {y: string};`,
      output: `let a: {
  x: number;
} & {
  y: string;
};`,
    },
    {
      title: 'Type literal: indexer',
      code: `let a: {
  [x:string]: number;
  [x:number]: boolean;
};`,
      output: `let a: {
  [x: string]: number;
  [x: number]: boolean;
};`,
    },
    {
      title: 'Type literal: indexer without key name',
      code: `let a: {
  [string]: number;
  [number]: boolean;
};`,
      output: `let a: {
  [x: string]: number;
  [x: number]: boolean;
};`,
    },
    {
      title: 'Type literal: indexer to mapped type - skip indexer',
      code: `let a: {
  [x:string]: number;
};`,
      output: `let a: {
  [x: string]: number;
};`,
    },
    {
      title: 'Type literal: indexer to mapped type',
      code: `let a: {
  [x:A]: number;
};`,
      output: `let a: { [x in A]: number };`,
    },
    {
      title: 'Type literal: type literal with variance',
      code: `let a: { +b: string, -c:number };`,
      output: `let a: {
  readonly b: string;
  c: number;
};`,
    },
    {
      title: 'Type literal: type literal with spread operator',
      code: `let a: { b: string, ...T };`,
      output: `let a: {
  b: string;
} & T;`,
    },
    {
      title: 'Type literal: deep type literal with spread operator',
      code: `let a: { b: { c: T, ...U} };`,
      output: `let a: {
  b: {
    c: T;
  } & U;
};`,
    },
    {
      title: 'Maybe type: variable declaration',
      code: `let a: ?string;`,
      output: `let a: string | undefined | null;`,
    },
    {
      title: 'Maybe type: type literal',
      code: `let a: { x: ?string };`,
      output: `let a: {
  x: string | undefined | null;
};`,
    },
    {
      title: 'Maybe type: type literal with optional key',
      code: `let a: { x?: ?string };`,
      output: `let a: {
  x?: string | null;
};`,
    },
    {
      title: 'Maybe type: required parameter in function declaration',
      code: `function f(arg: ?string) {}`,
      output: `function f(arg?: string | null) {}`,
    },
    {
      title: 'Maybe type: generic type instantiation',
      code: `let a: X<?T>;`,
      output: `let a: X<T | undefined | null>;`,
    },
    {
      title: 'Union type',
      code: `let a: string | number | boolean;`,
      output: `let a: string | number | boolean;`,
    },
    {
      title: 'Void literal',
      code: `let a: void;`,
      output: `let a: void;`,
    },
    {
      title: 'Function type',
      code: `function test(): string { return 'test'; }`,
      output: `function test(): string {
  return 'test';
}`,
    },
    {
      title: 'Function type (param)',
      code: `function test(arg: string): string { return arg; }`,
      output: `function test(arg: string): string {
  return arg;
}`,
    },
    {
      title: 'Function type (multi param)',
      code: `function test(arg1: string, arg2: number): string { return arg1; }`,
      output: `function test(arg1: string, arg2: number): string {
  return arg1;
}`,
    },
    {
      title: 'Arrow Function type',
      code: `let test: () => string;`,
      output: `let test: () => string; `,
    },
    {
      title: 'Arrow Function type (param)',
      code: `let test: (a: number) => string;`,
      output: `let test: (a: number) => string;`,
    },
    {
      title: 'Arrow Function type (multi params)',
      code: `let test: (a: number, b: string) => string;`,
      output: `let test: (a: number, b: string) => string;`,
    },
    {
      title: 'function type annotation with type parameters',
      code: `let test: <T>(a: number) => T;`,
      output: `let test: <T>(a: number) => T;`,
    },
    {
      title: 'maybe argument',
      code: `let test: (a: ?number) => T;`,
      output: `let test: (a?: number | null) => T;`,
    },
    {
      title: 'maybe argument with not null after it',
      code: `let test: (a: ?number, b: number) => T;`,
      output: `let test: (a: number | undefined | null, b: number) => T;`,
    },
    {
      title: 'function maybe argument',
      code: `let test: (a: ?(number=>number)) => T;`,
      output: `let test: (a?: ((a: number) => number) | null) => T;`,
    },
    {
      title: 'maybe function type annotation',
      code: `let test: ?(a: number) => T;`,
      output: `let test: ((a: number) => T) | undefined | null;`,
    },
    {
      title: 'Generic Function type',
      code: `function test<T>(value: T): T { return value; }`,
      output: `function test<T>(value: T): T {
  return value;
}`,
    },
    {
      title: 'Function type (rest param)',
      code: `function test(value: number, ...arg2: Array<string>): number { return value; }`,
      output: `function test(value: number, ...arg2: Array<string>): number {
  return value;
}`,
    },
    {
      title: 'Arrow Function type (rest param)',
      code: `let test: (value: number, ...args: Array<string>) => number;`,
      output: `let test: (value: number, ...args: Array<string>) => number;`,
    },
    {
      title: 'Qualified type',
      code: `let a: A.B;`,
      output: `let a: A.B;`,
    },
    {
      title: 'recursively qualified type',
      code: `import * as A from "a";
type B = A.A.A;`,
      output: `import * as A from "a";
type B = A.A.A;`,
    },
    {
      title: 'Tuple type',
      code: `let a: [number, string, Array<boolean>];`,
      output: `let a: [number, string, Array<boolean>];`,
    },
    {
      title: 'Object type',
      code: `let a: Object;`,
      output: `let a: object;`,
    },

    {
      title: 'preserves comments above imports',
      code: `// not flow comment
import * as React from "react";`,
      output: `// not flow comment
import * as React from "react";
`,
    },
    {
      title: 'with empty type parameters',
      code: `let a: A<>;`,
      output: `let a: A;`,
    },
  ],
});
