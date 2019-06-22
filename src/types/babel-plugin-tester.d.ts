declare namespace pluginTester {
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
}

declare function pluginTester(option: pluginTester.TesterOption): void;

export = pluginTester;
