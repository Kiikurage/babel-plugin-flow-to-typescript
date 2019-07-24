import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare function',
      code: `declare function something(): boolean;
declare function something(something: boolean): string;
declare function something(string): null;`,
      output: `declare function something(): boolean;
declare function something(something: boolean): string;
declare function something(a: string): null;`,
    },
    {
      title: 'tsParenthesizedType for function types in unions',
      code: `declare function A(create: {} | () => void): void;`,
      output: `declare function A(create: {} | (() => void)): void;`,
    },
    {
      title: 'predicate function declaration',
      code: `declare function foo(x: mixed): boolean %checks(x !== null);`,
      output: `declare function foo(x: unknown): boolean;`,
    },
  ],
});
