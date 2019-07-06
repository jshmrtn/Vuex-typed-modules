"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var builder_1 = require("./builder");
function enableHotReload(path, state, vuexModule, dynamic) {
    if (module.hot) {
        var appliedModule = builder_1.getStoredModule(path);
        if (!appliedModule && !dynamic) {
            builder_1.storeModule(path, state, vuexModule);
        }
        else if (appliedModule) {
            Object.assign(appliedModule, __assign({ namespaced: true, state: state }, vuexModule));
            builder_1.storeBuilder.hotUpdate({
                modules: __assign({}, builder_1.storedModules),
            });
            console.log("%c vuex-typed-modules %c " + (dynamic ? 'Dynamic' : '') + "Module '" + name + "' hot reloaded %c", 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#d64a17 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
        }
    }
}
exports.enableHotReload = enableHotReload;
function disableHotReload(path) {
    var parent = builder_1.getStoredModule(path.slice(0, -1));
    delete parent.modules[path.slice(-1)[0]];
}
exports.disableHotReload = disableHotReload;
