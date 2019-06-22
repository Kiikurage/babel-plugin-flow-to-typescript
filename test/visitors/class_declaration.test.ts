import * as pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { ClassMethod, ClassDeclaration, DeclareClass } from '../../src/visitors/class_declaration';

pluginTester({
  plugin: buildPlugin([ClassMethod, ClassDeclaration, DeclareClass]),
  tests: [
    {
      title: 'empty class',
      code: `class C {}`,
      output: `class C {}`,
    },
    {
      title: 'Class constructors: void return type annotation',
      code: `class C {
  constructor(): void {
  }
}`,
      output: `class C {
  constructor() {}

}`,
    },
    {
      title: 'Class constructors: No return type annotation',
      code: `class C {
  constructor() {
  }
}`,
      output: `class C {
  constructor() {}

}`,
    },
    {
      title: 'Extending class declaration types are transformed',
      code: `class C extends React.Component<?string, ?(string | boolean)> {}`,
      output:
        'class C extends React.Component<string | undefined | null, (string | boolean) | undefined | null> {}',
    },
    {
      title: 'Class declaration types are transformed',
      code: `class C implements Something<?string, ?(string | boolean)> {}`,
      output:
        'class C implements Something<string | undefined | null, (string | boolean) | undefined | null> {}',
    },
    {
      title: 'Class typings declaration types are transformed',
      code: `class C<X> implements Something<X, ?string, ?(string | boolean)> {}`,
      output:
        'class C<X> implements Something<X, string | undefined | null, (string | boolean) | undefined | null> {}',
    },
    {
      title: 'declare class',
      code: `declare class A<X,Y,Z> extends B<X<Y<Z>>> {
  static C: D<X, Y>;
  constructor(abc: boolean): A;
  E: boolean;
  F: ?X<Z>;
  g(): H;
  get getterX(): string;
  set setterY(boolean): number;
}`,
      output: `declare class A<X, Y, Z> extends B<X<Y<Z>>> {
  static C: D<X, Y>;
  constructor(abc: boolean): A;
  E: boolean;
  F: X<Z> | undefined | null;
  g(): H;
  get getterX(): string;
  set setterY(x0: boolean): number;
}`,
    },
  ],
});
