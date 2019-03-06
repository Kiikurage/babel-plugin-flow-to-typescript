import pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { TypeCastExpression } from '../../src/visitors/type_cast_expression';

pluginTester({
    plugin: buildPlugin([TypeCastExpression]),
    tests: [
        {
            title: 'type case expression',
            code: `(a: A);`,
            output: `(a as A);`,
        },
    ],
});
