import * as pluginTester from 'babel-plugin-tester';
import {buildPlugin} from '../../src/plugin';
import {TypeAlias} from '../../src/visitors/type_alias';

pluginTester({
    plugin: buildPlugin([TypeAlias]),
    tests: [{
        title: 'type alias',
        code: `type A = ?string;`,
        output: `type A = string | undefined | null;`
    }]
});

