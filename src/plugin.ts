export function buildPlugin(visitors: Function[]) {
    const visitorMap: { [name: string]: Function } = {};
    for (const visitor of visitors) visitorMap[visitor.name] = visitor;

    return () => ({
        name: 'babel-plugin-flow-to-typescript',
        visitor: visitorMap,

        //tslint:disable:no-any
        manipulateOptions(_opts: any, parserOpts: any) {
            parserOpts.plugins.push('flow');
            parserOpts.plugins.push('jsx');
            parserOpts.plugins.push('objectRestSpread');
            parserOpts.plugins.push('classProperties');
        }
    });
}
