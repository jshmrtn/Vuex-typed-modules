import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";

const state: LayoutModule.ModuleState = {
  backgroundColor: "red",
  stickyHeader: false,
  footerState: "HIDE",
};

export { getters, mutations, actions, state };
