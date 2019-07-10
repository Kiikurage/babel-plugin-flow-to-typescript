import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'Object type alias: exact=true',
      code: `type a = {| a: T |};`,
      output: `type a = {
  a: T;
};`,
    },
    {
      title: 'maybe function type',
      code: `type a = {
  a: ?()=>void;
};`,
      output: `type a = {
  a: (() => void) | undefined | null;
};`,
    },
    {
      title: 'preserves comments within typedefs',
      code: `type Props = {
  children?: React.Node,
  // The vertical alignment of the content before it starts to scroll
  verticalAlignWithoutScroll?: "top" | "center",
};`,
      output: `type Props = {
  children?: React.Node;
  // The vertical alignment of the content before it starts to scroll
  verticalAlignWithoutScroll?: "top" | "center";
};
`,
    },
    {
      title: 'preserves generics above imports',
      code: `export type UIOverlayType = React.Element<typeof Foo>;`,
      output: `export type UIOverlayType = React.Element<typeof Foo>;`,
    },
    {
      title: 'ObjectTypeCallProperty simple case',
      code: `
type T = {
  (string, string): string,
};
`,
      output: `
type T = {
  (b: string, a: string): string
};
`,
    },
    {
      title: 'Comment above type alias',
      code: `
// comment
type T = A;
`,
      output: `
// comment
type T = A;
`,
    },
  ],
});
