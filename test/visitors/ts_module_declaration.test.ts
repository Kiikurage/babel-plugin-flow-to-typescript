import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declares inside of a module',
      code: `declare module React {
  declare class A {}
}`,
      output: `declare module "React" {
  class A {}
}`,
    },
    {
      title: 'declares outside of a module',
      code: `declare module React {}

declare class A {}
`,
      output: `declare module "React" {}

declare class A {}
`,
    },
  ],
});
