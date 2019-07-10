import { Store, StoreOptions } from "vuex";
import { ReturnedMutations, ReturnedActions, ReturnedGetters, IMutationsPayload, IActionsPayload, IGettersPayload } from "./types";
declare let storeBuilder: Store<any>;
export declare function getStoredModule(path: ReadonlyArray<string>): any;
export declare function deleteStoredModule(path: ReadonlyArray<string>): void;
export declare function stateBuilder<S>(state: S, name: string): {
    registerMutations: <T extends IMutationsPayload>(mutations: T) => ReturnedMutations<T>;
    registerActions: <T extends IActionsPayload>(actions: T) => ReturnedActions<T>;
    registerGetters: <T extends IGettersPayload>(getters: T) => ReturnedGetters<T>;
    state: () => any;
};
export declare function defineModule<S, M extends IMutationsPayload, A extends IActionsPayload, G extends IGettersPayload>(name: string | string[], stateFactory: () => S, { actions, mutations, getters }: {
    actions: A;
    mutations: M;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
    resetState(): void;
    updateState(params: Partial<S>): void;
};
export declare function defineModule<S, M extends IMutationsPayload, A extends IActionsPayload>(name: string | string[], stateFactory: () => S, { actions, mutations }: {
    actions: A;
    mutations: M;
}): {
    actions: ReturnedActions<A>;
    mutations: ReturnedMutations<M>;
    state: S;
    resetState(): void;
    updateState(params: Partial<S>): void;
};
export declare function defineModule<S, M extends IMutationsPayload, G extends IGettersPayload>(name: string | string[], stateFactory: () => S, { mutations, getters }: {
    mutations: M;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    mutations: ReturnedMutations<M>;
    state: S;
    resetState(): void;
    updateState(params: Partial<S>): void;
};
export declare function defineModule<S, A extends IActionsPayload, G extends IGettersPayload>(name: string | string[], stateFactory: () => S, { actions, getters }: {
    actions: A;
    getters: G;
}): {
    getters: ReturnedGetters<G>;
    actions: ReturnedActions<A>;
    state: S;
    resetState(): void;
    updateState(params: Partial<S>): void;
};
export declare function defineModule<S, M extends IMutationsPayload>(name: string | string[], stateFactory: () => S, { mutations }: {
    mutations: M;
}): {
    mutations: ReturnedMutations<M>;
    state: S;
    resetState(): void;
    updateState(params: Partial<S>): void;
};
export declare function defineModule<S, A extends IActionsPayload>(name: string | string[], stateFactory: () => S, { actions }: {
    actions: A;
}): {
    actions: ReturnedActions<A>;
    state: S;
    resetState(): void;
    updateState(params: Partial<S>): void;
};
export declare function addNativeMutations(vuexModule: any, stateFactory: any): any;
export declare function storeModule(path: any, state: any, vuexModule: any): void;
export declare function prepareModules(): {};
export declare function createStore({ strict, ...options }: StoreOptions<any>): Store<any>;
export declare function resetStoredModules(): void;
export { storeBuilder };
