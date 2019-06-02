import * as pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import {
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
} from '../../src/visitors/export_declaration';

pluginTester({
  plugin: buildPlugin([ExportNamedDeclaration, ExportDefaultDeclaration]),
  tests: [
    {
      title: 'Removes type from exports',
      code: `type Something = A;
export type { Something };`,
      output: `type Something = A;
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
