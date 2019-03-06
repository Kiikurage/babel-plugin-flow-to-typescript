import pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import {
    ImportDeclaration,
    ImportSpecifier,
} from '../../src/visitors/import_declaration';

pluginTester({
    plugin: buildPlugin([ImportDeclaration, ImportSpecifier]),
    tests: [
        {
            title: 'import type statement',
            code: `import type { A } from "module";`,
            output: `import { A } from "module";`,
        },
        {
            title: 'import type specifier',
            code: `import A, { type B, C } from "module";`,
            output: `import A, { B, C } from "module";`,
        },
        {
            title: 'preserves comments',
            code: `// @flow\nimport * as React from \'react\';`,
            output: `// @flow\nimport * as React from \'react\';`,
        },
    ],
});
