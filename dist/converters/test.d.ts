declare type FlowMixed = boolean | number | symbol | string | {
    [x: string]: any;
};
declare function bar(a: FlowMixed): void;
