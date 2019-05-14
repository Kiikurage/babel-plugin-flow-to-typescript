import pluginTester from 'babel-plugin-tester';
import plugin from '../src/index';

pluginTester({
    plugin,
    tests: [
        {
            title: 'preserves generics above imports',
            code: `export type UIOverlayType = React.Element<typeof Foo>;`,
            output: `export type UIOverlayType = React.Element<typeof Foo>;`,
        },
    ],
});
