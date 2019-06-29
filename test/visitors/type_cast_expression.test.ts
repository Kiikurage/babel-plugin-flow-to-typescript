import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
  tests: [
    {
      title: 'type case expression',
      code: `(a: A);`,
      output: `(a as A);`,
    },
    {
      title: 'type case expression, with comments',
      code: `(/*1*/a/*2*/:/*3*/A/*4*/);`,
      output: `(
/*1*/
a
/*2*/
as
/*3*/
A
/*4*/
);`,
    },
  ],
});
