import template from '@babel/template';

/* tslint:disable */
let ast = template({
  plugins:['typescript'],
}).ast;

const $ObjMap = ast`type $ObjMap<T extends {}, F extends (v: any) => any> = {
  [K in keyof T]: F extends (v: T[K]) => infer R ? R : never;
};`;

const $TupleMap = ast`type $TupleMap<T extends {}, F extends (v: any) => any> = {
  [K in keyof T]: F extends (v: T[K]) => infer R ? R : never;
};`;

const $ObjMapi = ast`type $ObjMapi<T extends {}, F extends (k: any, v: any) => any> = {
  [K in keyof T]: F extends (k: K, v: T[K]) => infer R ? R : never;
};`;

const $Call1 = ast`type $Call1<F extends (...args: any) => any, A> = F extends (a: A, ...args: any) => infer R
  ? R
  : never;`;

const $Call2 = ast`type $Call2<F extends (...args: any) => any, A, B> = F extends (
  a: A,
  b: B,
  ...args: any
  ) => infer R
  ? R
  : never;`;

const $Call3 = ast`type $Call3<F extends (...args: any) => any, A, B, C> = F extends (
  a: A,
  b: B,
  c: C,
  ...args: any
  ) => infer R
  ? R
  : never;`;

const $Call4 = ast`type $Call4<F extends (...args: any) => any, A, B, C, D> = F extends (
  a: A,
  b: B,
  c: C,
  d: D,
  ...args: any
  ) => infer R
  ? R
  : never;`;

const $Call5 = ast`type $Call5<F extends (...args: any) => any, A, B, C, D, E> = F extends (
  a: A,
  b: B,
  c: C,
  d: D,
  d: E,
  ...args: any
  ) => infer R
  ? R
  : never;`;

export default {
  $ObjMap,
  $TupleMap,
  $ObjMapi,
  $Call1,
  $Call2,
  $Call3,
  $Call4,
  $Call5,
}
