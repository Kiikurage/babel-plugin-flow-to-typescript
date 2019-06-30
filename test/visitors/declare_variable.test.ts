import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare variable',
      code: `declare var screen: Screen;`,
      output: `declare var screen: Screen;`,
    },
  ],
});
