import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'opaque type',
      code: `opaque type A = B;`,
      output: `type A = B;`,
    },
    {
      title: 'opaque type with super type',
      code: `opaque type A: S = B;`,
      output: `type A = B;`,
    },
  ],
});
