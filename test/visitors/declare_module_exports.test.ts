import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare empty named module',
      code: `declare module React {
  declare module.exports: A;
}`,
      output: `declare namespace React {
  export = A;
}`,
    },
    {
      title: 'declare empty named module',
      code: `declare module React {
  declare module.exports: {
    a: number,
  };
}`,
      output: `declare namespace React {
  type __exports = {
    a: number;
  };
  export = __exports;
}`,
    },
  ],
});
