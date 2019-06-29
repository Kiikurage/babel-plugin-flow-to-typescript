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
      output: `function something(): boolean;
function something(something: boolean): string;
function something(a: string): null;`,
    },
  ],
});
