import { ReturnedGetters, ReturnedActions, ReturnedMutations } from "./types";
import { storeBuilder, stateBuilder, storeModule, deleteStoredModule, addNativeMutations } from "./builder";
import { enableHotReload, disableHotReload } from "./hotModule";

function stateExists(state: object, [address, ...path]: string[]) {
  if (!address) { return true; }
  if (!state[address]) { return false; }
  return stateExists(state[address], path);
}

class RegisterDynamicModule {
  public mutations = {};
  public actions = {};
  public getters = {};

  public Vuexmodule;
  public path;
  public name;

  public newState;

  public initialState;

  private registered = false;

  constructor(path, name, initialState, Vuexmodule) {
    this.path = path;
    this.Vuexmodule = Vuexmodule;
    this.name = name;
    this.initialState = initialState;
  }

  public resetState() {
    storeBuilder.commit(`${this.name}/resetState`);
  }

  public updateState(params) {
    storeBuilder.commit(`${this.name}/updateState`, params);
  }

  public get state() {
    if (!this.newState) {
      return {};
    }
    return this.newState();
  }

  public register() {
    if (this.registered) { return; }
    storeModule(this.path, this.initialState, {
      namespaced: true,
      state: this.initialState,
      ...this.Vuexmodule
    });
    if (!stateExists(storeBuilder.state, this.path)) {
      storeBuilder.registerModule(this.path, {
        namespaced: true,
        state: this.initialState,
        ...this.Vuexmodule
      });
      this.registered = true;
    }
    if (stateExists(storeBuilder.state, this.path)) {
      const {
        registerGetters,
        registerMutations,
        registerActions,
        state: newState
      } = stateBuilder(this.initialState, this.name);
      this.mutations = registerMutations(this.Vuexmodule.mutations);
      this.actions = registerActions(this.Vuexmodule.actions);
      this.getters = registerGetters(this.Vuexmodule.getters);
      this.newState = newState;
    }
  }
  public unregister() {
    storeBuilder.unregisterModule(this.name);
    this.registered = false;

    if (module.hot) {
      disableHotReload(this.path);
    } else {
      deleteStoredModule(this.path);
    }
  }
}

export function defineDynamicModule<
  S,
  M extends { [x: string]: (state, payload?) => void },
  A extends { [x: string]: (context, payload?) => any },
  G extends { [x: string]: (state) => any }
>(
  name: string | string[],
  state: S,
  { actions, mutations, getters }: { actions: A; mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
  register(): void;
  unregister(): void;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
export function defineDynamicModule<
  S,
  M extends { [x: string]: (state, payload?) => void },
  A extends { [x: string]: (context, payload?) => any }
>(
  name: string | string[],
  state: S,
  { actions, mutations }: { actions: A; mutations: M }
): {
  actions: ReturnedActions<A>;
  mutations: ReturnedMutations<M>;
  state: S;
  register(): void;
  unregister(): void;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
export function defineDynamicModule<
  S,
  M extends { [x: string]: (state, payload?) => void },
  G extends { [x: string]: (state) => any }
>(
  name: string | string[],
  state: S,
  { mutations, getters }: { mutations: M; getters: G }
): {
  getters: ReturnedGetters<G>;
  mutations: ReturnedMutations<M>;
  state: S;
  register(): void;
  unregister(): void;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
export function defineDynamicModule<
  S,
  A extends { [x: string]: (context, payload?) => any },
  G extends { [x: string]: (state) => any }
>(
  name: string | string[],
  state: S,
  { actions, getters }: { actions: A; getters: G }
): {
  getters: ReturnedGetters<G>;
  actions: ReturnedActions<A>;
  state: S;
  register(): void;
  unregister(): void;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
export function defineDynamicModule<
  S,
  M extends { [x: string]: (state, payload?) => void }
>(
  name: string | string[],
  state: S,
  { mutations }: { mutations: M }
): {
  mutations: ReturnedMutations<M>;
  state: S;
  register(): void;
  unregister(): void;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
export function defineDynamicModule<
  S,
  A extends { [x: string]: (context, payload?) => any }
>(
  name: string | string[],
  state: S,
  { actions }: { actions: A }
): {
  actions: ReturnedActions<A>;
  state: S;
  register(): void;
  unregister(): void;
  resetState(): void;
  updateState(params: Partial<S>): void;
};
export function defineDynamicModule(name, state, vuexModule) {
  vuexModule = addNativeMutations(vuexModule, state);
  enableHotReload(name, state, vuexModule, true);
  const path = Array.isArray(name) ? name : [name];
  name = path.join('/');
  return new RegisterDynamicModule(path, name, state, vuexModule) as any;
}
