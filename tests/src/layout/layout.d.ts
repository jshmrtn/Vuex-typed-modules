declare namespace LayoutModule {
  export namespace props {
    export type footerState = "SHOW" | "HIDE" | "STICKY";
  }
  ///
  export interface ModuleState {
    backgroundColor: string;
    stickyHeader: boolean;
    footerState: props.footerState
  }
  ///
  export type ActionContext = import("vuex").ActionContext<ModuleState, Store.RootState>;
}
