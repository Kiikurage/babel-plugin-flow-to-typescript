import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'Removes type from export all declaration',
      code: `export type * from 'module';`,
      output: `export * from 'module';`,
    },
  ],
});
