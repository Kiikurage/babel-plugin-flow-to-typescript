import { File } from '@babel/types';

export interface BabelPluginPass<PluginOptions extends object> {
  key: string | undefined | null;
  file: File;
  opts: PluginOptions;

  // The working directory that Babel's programmatic options are loaded
  // relative to.
  cwd: string;

  // The absolute path of the file being compiled.
  filename: string | void;

  set(key: unknown, val: unknown): void;
  // tslint:disable-next-line:no-any
  get(key: unknown): any;
}
