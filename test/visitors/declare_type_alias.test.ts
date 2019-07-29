import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare type alias',
      code: `declare type DOMHighResTimeStamp = number;`,
      output: `declare type DOMHighResTimeStamp = number;`,
    },
  ],
});
