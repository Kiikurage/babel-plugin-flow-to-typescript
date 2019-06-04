import * as pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { Program } from '../../src/visitors/program';

pluginTester({
  plugin: buildPlugin([Program]),
  tests: [
    {
      title: 'import type statement',
      code: `// @flow\nconst a = 55;\nexport default a;`,
      output: `const a = 55;\nexport default a;`,
    },
    {
      title: 'import type statement',
      code: `/* @flow */\nconst a = 55;\nexport default a;`,
      output: `const a = 55;\nexport default a;`,
    },
    {
      title: 'import type statement',
      code: `// @license MIT\n/* @flow */\nconst a = 55;\nexport default a;`,
      output: `// @license MIT\nconst a = 55;\nexport default a;`,
    },
  ],
});
