import pluginTester from 'babel-plugin-tester';
import plugin from '../src/index';

pluginTester({
    plugin,
    tests: [
        {
            title: 'preserves comments above imports',
            code: `// @flow\nimport * as React from "react";`,
            output: `// @flow
import * as React from "react";
`,
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
    ],
});
