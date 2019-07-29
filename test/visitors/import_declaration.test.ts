import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
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
  ],
});
