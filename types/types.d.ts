export declare type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true;
export declare type inferMutations<T> = T extends (state: any, payload: infer P) => void ? IsValidArg<P> extends true ? (payload: P) => void : () => void : () => void;
export declare type inferActions<T extends (context: any, payload?: any) => void> = T extends (context: any, payload: infer P) => any ? IsValidArg<P> extends true ? (payload: P) => ReturnType<T> : () => ReturnType<T> : ReturnType<T>;
export declare type inferGetters<T extends (state: any) => any> = T extends (state: any) => infer R ? R : void;
export declare type ReturnedGetters<T extends any> = {
    [K in keyof T]: inferGetters<T[K]>;
};
export declare type ReturnedActions<T extends any> = {
    [K in keyof T]: inferActions<T[K]>;
};
export declare type ReturnedMutations<T extends any> = {
    [K in keyof T]: inferMutations<T[K]>;
};