import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

//
// export type * from 'module' is NOT yet supported in v3.8
// see https://github.com/microsoft/TypeScript/pull/35200
//

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
