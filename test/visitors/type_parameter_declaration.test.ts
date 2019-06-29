import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'no constraints',
      code: `type A<T> = T;`,
      output: `type A<T> = T;`,
    },
    {
      title: 'with constraints',
      code: `type A<T: number> = T;`,
      output: `type A<T extends number> = T;`,
    },
    {
      title: 'with constraints having default',
      code: `type A<T: {} = R> = T;`,
      output: `type A<T extends {} = R> = T;`,
    },
    {
      title: 'with comments',
      code: `type A<
/* 1 */
T: {} = R
/* 2 */
> = T;`,
      output: `type A<
/* 1 */
T extends {} = R
/* 2 */
> = T;`,
    },
    {
      title: 'with more comments',
      code: `type A/*0*/</* 1 */T/* 2 */=/* 3 */F/* 4 */>/*5*/= T`,
      output: `type A
/*0*/
<
/* 1 */
T =
/* 2 */

/* 3 */
F
/* 4 */
> =
/*5*/
T;`,
    },
  ],
});
