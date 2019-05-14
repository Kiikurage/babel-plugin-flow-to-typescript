"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onlyOnceFlagSet = new Set();
function warnOnlyOnce(key, message) {
    if (!message)
        message = String(key);
    if (onlyOnceFlagSet.has(key))
        return;
    onlyOnceFlagSet.add(key);
    console.warn(message);
}
exports.warnOnlyOnce = warnOnlyOnce;
//tslint:disable:no-any
function isNodePath(fn, path) {
    return fn(path.node);
}
exports.isNodePath = isNodePath;
class UnsupportedError extends Error {
}
exports.UnsupportedError = UnsupportedError;
UnsupportedError.prototype.name = UnsupportedError.name;
//# sourceMappingURL=util.js.map