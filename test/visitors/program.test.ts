import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'program flow comment single line',
      code: `// @flow\nconst a = 55;\nexport default a;`,
      output: `const a = 55;\nexport default a;`,
    },
    {
      title: 'program flow comment block statement',
      code: `/* @flow */\nconst a = 55;\nexport default a;`,
      output: `const a = 55;\nexport default a;`,
    },
    {
      title: 'program flow comment with license',
      code: `// @license MIT\n/* @flow */\nconst a = 55;\nexport default a;`,
      output: `// @license MIT\nconst a = 55;\nexport default a;`,
    },
    {
      title: 'helper types',
      code: `
let a: $ObjMap<A,B>;
let b: $TupleMap<A,B>;
let c: $ObjMapi<A,B>;
let d: $Call<A>;
let e: $Call<A,B>;
let f: $Call<A,B,C>;
let g: $Call<A,B,C,D>;
let h: $Call<A,B,C,D,E>;
let i: $Call<A,B,C,D,E,F>;
let j: $Call<A,B,C,D,E,F,G>;
`,
      output: `
type $ObjMap<T extends {}, F extends (v: any) => any> = { [K in keyof T]: F extends (v: T[K]) => infer R ? R : never };
type $TupleMap<T extends {}, F extends (v: any) => any> = { [K in keyof T]: F extends (v: T[K]) => infer R ? R : never };
type $ObjMapi<T extends {}, F extends (k: any, v: any) => any> = { [K in keyof T]: F extends (k: K, v: T[K]) => infer R ? R : never };
type $Call1<F extends (...args: any) => any, A> = F extends (a: A, ...args: any) => infer R ? R : never;
type $Call2<F extends (...args: any) => any, A, B> = F extends (a: A, b: B, ...args: any) => infer R ? R : never;
type $Call3<F extends (...args: any) => any, A, B, C> = F extends (a: A, b: B, c: C, ...args: any) => infer R ? R : never;
type $Call4<F extends (...args: any) => any, A, B, C, D> = F extends (a: A, b: B, c: C, d: D, ...args: any) => infer R ? R : never;
type $Call5<F extends (...args: any) => any, A, B, C, D, E> = F extends (a: A, b: B, c: C, d: D, d: E, ...args: any) => infer R ? R : never;
let a: $ObjMap<A, B>;
let b: $TupleMap<A, B>;
let c: $ObjMapi<A, B>;
let d: ReturnType<A>;
let e: $Call1<A, B>;
let f: $Call2<A, B, C>;
let g: $Call3<A, B, C, D>;
let h: $Call4<A, B, C, D, E>;
let i: $Call5<A, B, C, D, E, F>;
let j: $Call<A, B, C, D, E, F, G>;
`,
    },
    {
      title: 'call helper type',
      code: `
type A = string | Class<React.Component<*, *>> | Object;
type B = Class<{
  +scope: TagsType => void,
}>;
type C = Class<A>;
`,
      output: `type Class<T> = new (...args: any) => T;
type A = string | Class<React.Component<any, any>> | object;
type B = Class<{
  readonly scope: (a: TagsType) => void;
}>;
type C = Class<A>;
`,
    },
  ],
});
