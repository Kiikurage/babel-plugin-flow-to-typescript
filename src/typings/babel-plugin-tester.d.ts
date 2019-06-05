declare module 'babel-plugin-tester' {
  // tslint:disable:no-any
  export interface TesterOption {
    plugin: any;
    snapshot?: boolean;
    tests: Test[];
  }

  export interface Test {
    title?: string;
    code?: string;
    output?: string;
    snapshot?: boolean;
    fixture?: string;
    outputFixture?: string;
  }

  function pluginTester(option: TesterOption): void;

  export default pluginTester;
}
