import { defineModule } from "../../../src";

import { state, actions, getters, mutations } from "./module";

export const layout = defineModule("layout", state, {
  getters,
  mutations,
  actions,
});

export default layout;
