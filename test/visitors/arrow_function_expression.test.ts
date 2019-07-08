import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'empty',
      code: `const f = () => {};`,
      output: `const f = () => {};`,
    },
    {
      title: 'return type',
      code: `const f = (): T => {};`,
      output: `const f = (): T => {};`,
    },
    {
      title: 'argument type',
      code: `const f = (a: T, b: R): T => {};`,
      output: `const f = (a: T, b: R): T => {};`,
    },
    {
      title: 'simple generic',
      code: `const f = <T>(v: T): T => {};`,
      output: `const f = <T extends any>(v: T): T => {};`,
    },
    {
      title: 'optional argument',
      code: `const f = (arg?: string) => {};`,
      output: `const f = (arg?: string) => {};`,
    },
    {
      title: 'maybe argument',
      code: `const f = (arg: ?string) => {};`,
      output: `const f = (arg?: string | null) => {};`,
    },
    {
      title: 'optional maybe argument',
      code: `const f = (arg?: ?string) => {};`,
      output: `const f = (arg?: string | null) => {};`,
    },
    {
      title: 'rest parameters',
      code: `const f = (...args) => {};`,
      output: `const f = (...args) => {};`,
    },
    {
      title: 'arrow function with type parameters for JSX context',
      code: `const a = <T, R>(v: T) => v;`,
      output: `const a = <T extends any, R>(v: T) => v;`,
    },
    {
      title: 'arrow function with type parameters for JSX context',
      code: `export const a = <T>(
  a?: A<T>,
  b: B,
): ?T => {};`,
      output: `export const a = <T extends any>(a: A<T> | undefined | null, b: B): T | undefined | null => {};`,
    },
  ],
});
