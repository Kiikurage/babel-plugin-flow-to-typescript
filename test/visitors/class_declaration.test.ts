import * as pluginTester from 'babel-plugin-tester';
import {buildPlugin} from '../../src/plugin';
import {ClassMethod} from '../../src/visitors/class_declaration';

pluginTester({
    plugin: buildPlugin([ClassMethod]),
    tests: [{
        title: 'Class constructors: No return type annotation',
        code: `class C {
  constructor(): void {
  }
}`,
        output: `class C {
  constructor() {}

}`,
    }]
});
