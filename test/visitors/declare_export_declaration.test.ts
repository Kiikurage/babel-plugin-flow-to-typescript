import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare empty named module',
      code: `declare module 'react' {
  declare export default {|
    a: number
  |}
}`,
      output: `declare module 'react' {
  const __default: {
    a: number;
  };
  export default __default;
}`,
    },
  ],
});
