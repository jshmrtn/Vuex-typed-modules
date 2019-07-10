import Vuex, { Store, StoreOptions } from "vuex";
import Vue from "vue";
import {
  ReturnedMutations,
  ReturnedActions,
  ReturnedGetters,
  IMutationsPayload,
  IActionsPayload,
  IGettersPayload
} from "./types";
import { enableHotReload } from "./hotModule";

Vue.use(Vuex);

let storeBuilder: Store<any> = null;
let storedModules: Array<{path: string[], module: any}> = [];

function getStoredModule(path: ReadonlyArray<string>) {
  const stored = storedModules.find((stored) => path.join('/') === stored.path.join('/'));
  if (!stored) { return null; }
  return stored.module;
}

function createModuleTriggers(moduleName: string) {
  function commit(name) {
    return payload => storeBuilder.commit(moduleName + "/" + name, payload);
  }

  function dispatch(name) {
    return payload => storeBuilder.dispatch(moduleName + "/" + name, payload);
  }

  function read(name) {
    return () => {
      if (!storeBuilder || !storeBuilder.getters || !storeBuilder.getters[moduleName + "/" + name]) {
        return null;
      }
      return storeBuilder.getters[moduleName + "/" + name];
    };
  }

  return {
    commit,
    dispatch,
    read,
    get state() {
      return () => storeBuilder.state[moduleName];
    }
  };
}

function stateBuilder<S>(state: S, name: string) {
  const b = createModuleTriggers(name);

  const registerMutations = <T extends IMutationsPayload>(
    mutations: T
  ): ReturnedMutations<T> => {
    const renderedMutations = {};
    if (mutations) {
      Object.keys(mutations).map(key => {
        renderedMutations[key] = b.commit(key);
      });
    }
    return renderedMutations as any;
  };

  const registerActions = <T extends IActionsPayload>(
    actions: T
  ): ReturnedActions<T> => {
    const renderedActions = {};
    if (actions) {
      Object.keys(actions).map(key => {
        renderedActions[key] = b.dispatch(key);
      });
    }
    return renderedActions as any;
  };

  const registerGetters = <T extends IGettersPayload>(
    getters: T
  ): ReturnedGetters<T> => {
    const renderedGetters = {};
    if (getters) {
      Object.keys(getters).map((key: any) => {
        Object.defineProperty(renderedGetters, key, {
          get() {
            return b.read(key)();
          }
        });
      });
    }
    return renderedGetters as any;
  };

  return {
    registerMutations,
    registerActions,
    registerGetters,
    state: b.state
  };
}

function defineModule<
  S,
  M extends IMutationsPayload,
  A extends IActionsPayload,
  G extends IGettersPayload
>(
  name: string | string[],
  state: S,
  { actions, mutations, getters }: { actions: A; mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
function defineModule<S, M extends IMutationsPayload, A extends IActionsPayload>(
  name: string | string[],
  state: S,
  { actions, mutations }: { actions: A; mutations: M }
): {
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
function defineModule<S, M extends IMutationsPayload, G extends IGettersPayload>(
  name: string| string[],
  state: S,
  { mutations, getters }: { mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  mutations: ReturnedMutations<M>;
  state: S;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
function defineModule<S, A extends IActionsPayload, G extends IGettersPayload>(
  name: string| string[],
  state: S,
  { actions, getters }: { actions: A; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  state: S;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
function defineModule<S, M extends IMutationsPayload>(
  name: string| string[],
  state: S,
  { mutations }: { mutations: M }
): {
  mutations: ReturnedMutations<M>;
  state: S;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
function defineModule<S, A extends IActionsPayload>(
  name: string | string[],
  state: S,
  { actions }: { actions: A }
): {
  actions: ReturnedActions<A>;
  state: S;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
function defineModule(name, state, vuexModule) {
  const path = Array.isArray(name) ? name : [name];
  name = path.join('/');

  if (!vuexModule.mutations) { vuexModule.mutations = {}; }
  vuexModule.mutations.resetState = moduleState => {
    Object.keys(state).map(key => {
      Vue.set(moduleState, key, state[key]);
    });
  };
  vuexModule.mutations.updateState = (moduleState, params) => {
    Object.keys(params).map(key => {
      Vue.set(moduleState, key, params[key]);
    });
  };
  if (module.hot) {
    enableHotReload(path, state, vuexModule);
  } else {
    storeModule(path, state, vuexModule);
  }

  const {
    registerGetters,
    registerMutations,
    registerActions,
    state: newState
  } = stateBuilder(state, name);

  return {
    mutations: registerMutations(vuexModule.mutations),
    actions: registerActions(vuexModule.actions),
    getters: registerGetters(vuexModule.getters),
    resetState() {
      storeBuilder.commit(`${name}/resetState`);
    },
    updateState(params) {
      storeBuilder.commit(`${name}/updateState`, params);
    },
    get state() {
      return newState();
    }
  } as any;
}

function storeModule(path, state, vuexModule) {
  storedModules.push({
    path,
    module: {
      namespaced: true,
      modules: {},
      state,
      ...vuexModule,
    }
  });
}

function prepareModules() {
  return storedModules
    .sort((a, b) => a.path.length - b.path.length)
    .reduce((accModules, {path, module}) => {
      const parentModule = path.length === 1 ? accModules : getStoredModule(path.slice(0, -1));

      if (!parentModule) {
        throw new Error(`Parent Module of ${path.join('/')} not found`);
      }

      parentModule.modules[path.slice(-1)[0]] = module;

      return accModules;
    }, {modules: {}}).modules;
}

function createStore({ strict = false, ...options }: StoreOptions<any>) {
  storeBuilder = new Vuex.Store({
    strict,
    ...options,
    modules: prepareModules(),
  });
  storeBuilder.subscribeAction({
    before: (action, state) => {
      const moduleName = action.type.split("/")[0];
      const type = action.type.split("/")[1];
      console.groupCollapsed(
        `%c Vuex Action %c ${moduleName} %c ${type} %c`,
        "background: #451382 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
        "background:#fff;padding: 1px;color: #451382",
        "background:#2788d2;padding: 1px;border-radius: 0 3px 3px 0;color: #fff",
        "background:transparent"
      );
      console.log("PAYLOAD", action.payload);
      console.log("STATE", state);
      console.groupEnd();
    }
  });
  return storeBuilder;
}

function resetStoredModules() {
  storedModules = [];
}

export {
  storeBuilder,
  createStore,
  stateBuilder,
  defineModule,
  prepareModules,
  getStoredModule,
  storeModule,
  resetStoredModules,
};
