"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildPlugin(visitors) {
    const visitorMap = {};
    for (const visitor of visitors)
        visitorMap[visitor.name] = (path) => {
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
        manipulateOptions(_opts, parserOpts) {
            parserOpts.plugins.push('flow');
            parserOpts.plugins.push('jsx');
            parserOpts.plugins.push('classProperties');
            parserOpts.plugins.push('objectRestSpread');
        },
    });
}
exports.buildPlugin = buildPlugin;
//# sourceMappingURL=plugin.js.map