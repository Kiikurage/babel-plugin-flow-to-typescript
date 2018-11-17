import * as pluginTester from 'babel-plugin-tester';
import {buildPlugin} from '../../src/plugin';
import {ExportDeclaration} from '../../src/visitors/export_declaration';

pluginTester({
    plugin: buildPlugin([ExportDeclaration]),
    tests: [{
        title: 'export type',
        code: `export type { A } from 'test';`,
        output: `export { A } from 'test';`
    }]
});
