import * as pluginTester from 'babel-plugin-tester';
import {buildPlugin} from '../../src/plugin';
import {ExportNamedDeclaration} from '../../src/visitors/export_declaration';

pluginTester({
    plugin: buildPlugin([ExportNamedDeclaration]),
    tests: [{
        title: 'Removes type from exports',
        code: `export type { Something };`,
        output: `export { Something };`
    }]
});
