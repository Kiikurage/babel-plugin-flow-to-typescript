import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare empty named module',
      code: `declare module 'react' {
  declare export var a: number;
  declare export function isValidElement(element: any): boolean;
  declare export type ComponentType<P> = React$ComponentType<P>;
  declare export default {|
    a: number
  |}
}`,
      output: `declare module 'react' {
  export var a: number;
  export function isValidElement(element: any): boolean;
  export type ComponentType<P> = React$ComponentType<P>;
  const __default: {
    a: number;
  };
  export default __default;
}`,
    },
  ],
});
