import * as pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { InterfaceDeclaration } from '../../src/visitors/interface_declaration';

pluginTester({
  plugin: buildPlugin([InterfaceDeclaration]),
  tests: [
    {
      title: 'interface decl basic',
      code: `interface Something {
  something: string;
}`,
      output: `interface Something {
  something: string;
}`,
    },
    {
      title: 'interface decl extend',
      code: `interface Something<A> extends Another<A, B> {
  something: string;
}`,
      output: `interface Something<A> extends Another<A, B> {
  something: string;
}`,
    },
    {
      title: 'interface decl implement',
      code: `interface Something<A> implements Another<A, B> {
  something: string;
}`,
      output: `interface Something<A> extends Another<A, B> {
  something: string;
}`,
    },

    {
      title: 'interface decl implement extend',
      code: `interface Something<A> extends What<Yes> implements Another<A, B> {
  something: string;
}`,
      output: `interface Something<A> extends What<Yes>, Another<A, B> {
  something: string;
}`,
    },
  ],
});
