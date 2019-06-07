import pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { OptionalMemberExpression } from '../../src/visitors/optional_member_expression';

pluginTester({
  plugin: buildPlugin([OptionalMemberExpression]),
  tests: [
    {
      title: 'optional member expression',
      code: `console.log(a?.b);`,
      output: `console.log(a == null ? undefined : a.b == null ? undefined : a.b);`,
    },
    {
      title: 'optional multi member expression',
      code: `console.log(a?.b?.c);`,
      output: `console.log(a == null ? undefined : a.b == null ? undefined : a.b.c == null ? undefined : a.b.c);`,
    },
    {
      title: 'optional multi mixed member expression',
      code: `console.log(a.b?.c);`,
      output: `console.log(a.b == null ? undefined : a.b.c == null ? undefined : a.b.c);`,
    },
  ],
});
