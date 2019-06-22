import pluginTester from 'babel-plugin-tester';
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
      code: `export type { Something };`,
      output: `export { Something };`,
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
