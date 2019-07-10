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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var builder_1 = require("./builder");
var hotModule_1 = require("./hotModule");
function stateExists(state, _a) {
    var _b = __read(_a), address = _b[0], path = _b.slice(1);
    if (!address) {
        return true;
    }
    if (!state[address]) {
        return false;
    }
    return stateExists(state[address], path);
}
var RegisterDynamicModule = (function () {
    function RegisterDynamicModule(path, name, state, Vuexmodule) {
        this.mutations = {};
        this.actions = {};
        this.getters = {};
        this.newState = {};
        this.registered = false;
        this.path = path;
        this.Vuexmodule = Vuexmodule;
        this.name = name;
        this.initialState = state;
        Object.defineProperty(this, "state", {
            get: function () {
                return this.newState;
            },
            set: function (value) {
                this.newState = value;
            }
        });
    }
    RegisterDynamicModule.prototype.register = function () {
        if (this.registered) {
            return;
        }
        builder_1.storeModule(this.path, this.initialState, __assign({ namespaced: true, state: this.initialState }, this.Vuexmodule));
        if (!stateExists(builder_1.storeBuilder.state, this.path)) {
            builder_1.storeBuilder.registerModule(this.path, __assign({ namespaced: true, state: this.initialState }, this.Vuexmodule));
            this.registered = true;
        }
        if (stateExists(builder_1.storeBuilder.state, this.path)) {
            var _a = builder_1.stateBuilder(this.initialState, this.name), registerGetters = _a.registerGetters, registerMutations = _a.registerMutations, registerActions = _a.registerActions, newState = _a.state;
            (this.mutations = registerMutations(this.Vuexmodule.mutations)),
                (this.actions = registerActions(this.Vuexmodule.actions)),
                (this.getters = registerGetters(this.Vuexmodule.getters)),
                (this.newState = newState);
        }
    };
    RegisterDynamicModule.prototype.unregister = function () {
        if (!module.hot) {
            builder_1.storeBuilder.unregisterModule(this.name);
            hotModule_1.disableHotReload(this.path);
            this.mutations = {};
            this.actions = {};
            this.getters = {};
            this.state = {};
            this.registered = false;
        }
    };
    return RegisterDynamicModule;
}());
function defineDynamicModule(name, state, vuexModule) {
    hotModule_1.enableHotReload(name, state, vuexModule, true);
    var path = Array.isArray(name) ? name : [name];
    name = path.join('/');
    return new RegisterDynamicModule(path, name, state, vuexModule);
}
exports.defineDynamicModule = defineDynamicModule;
