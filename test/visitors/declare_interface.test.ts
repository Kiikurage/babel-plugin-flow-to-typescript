import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare interface',
      code: `declare interface A {
  id: string;
  type: string;
}`,
      output: `declare interface A {
  id: string;
  type: string;
}`,
    },
    {
      title: 'declare interface with call property',
      code: `declare interface A {
  (): void
}`,
      output: `declare interface A {
  (): void
}`,
    },
    {
      title: 'declare interface with indexer property',
      code: `declare interface A {
  [k: number]: string;
}`,
      output: `declare interface A {
  [k: number]: string;
}`,
    },
    {
      title: 'declare interface with internal slot',
      code: `declare interface C {
  [[foo]]: T;
  [[bar]](): T;
}`,
      output: `declare interface C {
  [foo]: T;
  [bar](): T;
}`,
    },
    {
      title: 'comments',
      code: `/**
 * bla bla bla
 */
declare interface A {
  // fields
  props: Props;
  // state
  state: State;
}
`,
      output: `/**
 * bla bla bla
 */
declare interface A {
  // fields
  props: Props;
  // state
  state: State;
}`,
    },
  ],
});
