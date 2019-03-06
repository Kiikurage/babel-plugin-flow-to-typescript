import { babelOptions } from '../../src/converter';
import * as babel from '@babel/core';

type TestCase = {
    title: string;
    code: string;
    output: string;
};

const runner = function(testCases: TestCase[]) {
    testCases.forEach(c => {
        it(c.title, () => {
            expect(babel.transform(c.code, babelOptions('src'))!.code).toBe(
                c.output
            );
        });
    });
};

describe('recast converter', () => {
    runner([
        {
            title: 'preserves generics above imports',
            code: `export type UIOverlayType = React.Element<typeof Foo>`,
            output: `export type UIOverlayType = React.Element<typeof Foo>;\n`,
        },
        /* TODO: doesn't introduce new generics
    {
      title: "preserves comments within typedefs",
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
  }
` */
    ]);
});
