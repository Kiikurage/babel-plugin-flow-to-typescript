import * as pluginTester from 'babel-plugin-tester';
import {buildPlugin} from '../../src/plugin';
import {ImportDeclaration} from '../../src/visitors/import_declaration';

pluginTester({
    plugin: buildPlugin([ImportDeclaration]),
    tests: [{
        title: 'import type statement',
        code: `import type { A } from "module";`,
        output: `import { A } from "module";`
    }]
});
