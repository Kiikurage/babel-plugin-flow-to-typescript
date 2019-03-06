import pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import {
    ClassMethod,
    ClassDeclaration,
} from '../../src/visitors/class_declaration';

pluginTester({
    plugin: buildPlugin([ClassMethod, ClassDeclaration]),
    tests: [
        {
            title: 'Class constructors: No return type annotation',
            code: `class C {
  constructor(): void {
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
                'class C extends React.Component<string | undefined | null, string | boolean | undefined | null> {}',
        },
        {
            title: 'Class declaration types are transformed',
            code: `class C implements Something<?string, ?(string | boolean)> {}`,
            output:
                'class C implements Something<string | undefined | null, string | boolean | undefined | null> {}',
        },
    ],
});
