import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare opaque type',
      code: `declare opaque type TimeoutID;`,
      output: `declare type TimeoutID = unknown;`,
    },
    {
      title: 'declare opaque type',
      code: `declare opaque type TimeoutID: number;`,
      output: `declare type TimeoutID = unknown;`,
    },
  ],
});
