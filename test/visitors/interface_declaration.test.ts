import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
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
      code: `interface Something extends Another {
  something: string;
}`,
      output: `interface Something extends Another {
  something: string;
}`,
    },
    {
      title: 'interface decl extend params',
      code: `interface Something<A> extends Another<A, B> {
  something: string;
}`,
      output: `interface Something<A> extends Another<A, B> {
  something: string;
}`,
    },
    {
      title: 'interface decl implement',
      code: `interface Something implements Another {
  something: string;
}`,
      output: `interface Something extends Another {
  something: string;
}`,
    },
    {
      title: 'interface decl implement params',
      code: `interface Something<A> implements Another<A, B> {
  something: string;
}`,
      output: `interface Something<A> extends Another<A, B> {
  something: string;
}`,
    },
    {
      title: 'interface decl implement extend',
      code: `interface Something extends What implements Another {
  something: string;
}`,
      output: `interface Something extends What, Another {
  something: string;
}`,
    },
    {
      title: 'interface decl implement extend params',
      code: `interface Something<A> extends What<Yes> implements Another<A, B> {
  something: string;
}`,
      output: `interface Something<A> extends What<Yes>, Another<A, B> {
  something: string;
}`,
    },
    {
      title: 'interface decl method',
      code: `interface Something<A> extends What<Yes> implements Another<A, B> {
  something(): string;
}`,
      output: `interface Something<A> extends What<Yes>, Another<A, B> {
  something(): string;
}`,
    },
    {
      title: 'interface with generic method',
      code: `interface A {
  map<T>(fn: (node: this, index: number) => T): Array<T>;
}`,
      output: `interface A {
  map<T>(fn: (node: this, index: number) => T): Array<T>;
}`,
    },
    {
      title: 'iterable interface',
      code: `interface A {
  @@iterator(): Iterator<string>;
}`,
      output: `interface A {
  [Symbol.iterator](): Iterator<string>;
}`,
    },
  ],
});
