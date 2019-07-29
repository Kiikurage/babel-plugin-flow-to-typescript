import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'simple case',
      code: `// @flow
new A<number>();`,
      output: `new A<number>();`,
    },
  ],
});
