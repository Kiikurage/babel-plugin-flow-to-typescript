import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin: plugin,
  tests: [
    {
      title: 'simple case',
      code: `// @flow
createPlugin<number>();`,
      output: `createPlugin<number>();`,
    },
    {
      title: 'simple case',
      code: `// @flow
createPlugin<*, mixed>();`,
      output: `createPlugin<any, unknown>();`,
    },
  ],
});
