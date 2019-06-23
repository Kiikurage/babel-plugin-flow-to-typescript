import * as pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { DeclareFunction } from '../../src/visitors/declare_function';

pluginTester({
  plugin: buildPlugin([DeclareFunction]),
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
