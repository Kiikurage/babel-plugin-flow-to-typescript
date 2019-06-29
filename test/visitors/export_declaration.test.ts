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
    {
      title:
        'Assigns type cast on default exports to a temporary variable then exports the variable',
      code: `export default ("some": Thing);`,
      output: `const _moduleExport: Thing = "some";
export default _moduleExport;`,
    },
  ],
});
