import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'Removes type from exports',
      code: `type Something = void;
export type { Something };`,
      output: `type Something = void;
export { Something };`,
    },
  ],
});
