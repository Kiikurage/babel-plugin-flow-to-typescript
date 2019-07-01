import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'declare module with a bit of everything',
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
    {
      title: 'export default',
      code: `declare module 'react' {
  declare export default function isValidElement(element: any): boolean;
  declare export default class A {}
}`,
      output: `declare module 'react' {
  export default function isValidElement(element: any): boolean;
  export default class A {}
}`,
    },
  ],
});
