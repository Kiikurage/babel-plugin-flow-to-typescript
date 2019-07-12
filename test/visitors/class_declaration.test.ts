import * as pluginTester from 'babel-plugin-tester';
import plugin from '../../src';

pluginTester({
  plugin,
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
      title: 'ThisTypeAnnotation',
      code: `class Foo {
  bar(): this {
    return this;
  }

}`,
      output: `class Foo {
  bar(): this {
    return this;
  }

}`,
    },
    {
      title: 'ClassExpression',
      code: `let a = class extends Another<Type> {};`,
      output: `let a = class extends Another<Type> {};`,
    },
  ],
});
