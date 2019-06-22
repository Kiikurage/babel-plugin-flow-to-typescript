import * as pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { TypeParameterDeclaration } from '../../src/visitors/type_parameter_declaration';

pluginTester({
  plugin: buildPlugin([TypeParameterDeclaration]),
  tests: [
    {
      title: 'function, no constraints',
      code: `function test<T>(a: T): T {}`,
      output: `function test<T>(a: T): T {}`,
    },
    {
      title: 'function with constraints',
      code: `function test<T: number>(a: T): T {}`,
      output: `function test<T extends number>(a: T): T {}`,
    },
  ],
});
