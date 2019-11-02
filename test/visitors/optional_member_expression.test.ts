import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  // todo: it looks there is a bug in babel resulting in additional parenthesis when generating code with optional chaining
  tests: [
    {
      title: 'optional member expression',
      code: `console.log(a?.b);`,
      output: `console.log((a?.b));`,
    },
    {
      title: 'optional multi member expression',
      code: `console.log(a?.b?.c);`,
      output: `console.log((a?.b?.c));`,
    },
    {
      title: 'optional multi mixed member expression',
      code: `console.log(a.b?.c);`,
      output: `console.log((a.b?.c));`,
    },
    {
      title: 'Optional numeral literal access',
      code: `console.log(a?.[0]?.c);`,
      output: `console.log((a?.[0]?.c));`,
    },
  ],
});
