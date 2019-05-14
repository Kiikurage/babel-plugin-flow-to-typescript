export declare function buildPlugin(visitors: Function[]): () => {
    name: string;
    visitor: {
        [name: string]: Function;
    };
    manipulateOptions(_opts: any, parserOpts: any): void;
};
