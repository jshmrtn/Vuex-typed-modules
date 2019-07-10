import { defineModule } from "../../../src";

import { actions, getters, mutations } from "./module";

export function state(): LayoutModule.ModuleState {
  return {
    backgroundColor: "red",
    stickyHeader: false,
    footerState: "HIDE",
  };
}

export const layout = defineModule("layout", state(), {
  getters,
  mutations,
  actions,
});

export default layout;
