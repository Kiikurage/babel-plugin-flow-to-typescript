import * as pluginTester from 'babel-plugin-tester';
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
    {
      title: 'Optional numeral literal access',
      code: `console.log(a?.[0]?.c);`,
      output: `console.log(a == null ? undefined : a[0] == null ? undefined : a[0].c == null ? undefined : a[0].c);`,
    },
  ],
});
