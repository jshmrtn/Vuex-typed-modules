import { defineModule } from "../../src";
import { ActionContext as BaseActionContext } from "vuex";
import { RootState } from ".";

export interface ModuleState {
  property: string;
}

export type ActionContext = BaseActionContext<ModuleState, RootState>;

export function state(): ModuleState {
  return {
    property: "red",
  };
}

export const getters = {
  property(state: ModuleState) {
    return state.property;
  }
};

export const mutations = {
  setProperty(state: ModuleState, property: string) {
    state.property = property;
  }
};

export const actions = {
  async load(context: ActionContext) {
    const respondData: string = await new Promise((resolve) => {
      setTimeout(() => {
        resolve("red");
      }, 500);
    });

    module.mutations.setProperty(respondData);
  }
};

export const module = defineModule("module", state, {
  getters,
  mutations,
  actions,
});

export default module;