import {NodePath} from '@babel/traverse';

export function buildPlugin(visitors: Function[]) {
    const visitorMap: {[name: string]: Function} = {};
    for (const visitor of visitors)
        visitorMap[visitor.name] = (path: NodePath<any>) => {
            const comments = path && path.node.comments;
            visitor(path);
            if (!path.node.comments) {
                path.node.comments = comments;
            }
        };

    return () => ({
        name: 'babel-plugin-flow-to-typescript',
        visitor: visitorMap,

        //tslint:disable:no-any
        manipulateOptions(_opts: any, parserOpts: any) {
            parserOpts.plugins.push('flow');
            parserOpts.plugins.push('jsx');
            parserOpts.plugins.push('classProperties');
            parserOpts.plugins.push('objectRestSpread');
        },
    });
}
