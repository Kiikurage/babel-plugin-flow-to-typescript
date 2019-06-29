import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'empty',
      code: `function f() {}`,
      output: `function f() {}`,
    },
    {
      title: 'return type',
      code: `function f(): T {}`,
      output: `function f(): T {}`,
    },
    {
      title: 'argument type',
      code: `function f(a: T, b: R): T {}`,
      output: `function f(a: T, b: R): T {}`,
    },
    {
      title: 'simple generic',
      code: `function f<T>(v: T): T {}`,
      output: `function f<T>(v: T): T {}`,
    },
    {
      title: 'optional argument',
      code: `function f(arg?: string) {}`,
      output: `function f(arg?: string) {}`,
    },
    {
      title: 'maybe argument',
      code: `function f(arg: ?string) {}`,
      output: `function f(arg: string | undefined | null) {}`,
    },
    {
      title: 'optional maybe argument',
      code: `function f(arg?: ?string) {}`,
      output: `function f(arg?: string | null) {}`,
    },
    {
      title: 'rest parameters',
      code: `function f(...args) {}`,
      output: `function f(...args) {}`,
    },
  ],
});
