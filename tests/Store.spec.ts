import { createLocalVue } from '@vue/test-utils';

import { createStore, defineModule } from "../src";

import Vuex from 'vuex';

import { state, actions, getters, mutations } from "./src/layout/module";

import _cloneDeep from "lodash/cloneDeep";

describe("Store", () => {
  describe('Base Capabilities', () => {
    let layout;
    let localVue;
    let store;

    beforeEach((done) => {
      layout = defineModule("layout", _cloneDeep(state), {
        getters,
        mutations,
        actions,
      });
      localVue = createLocalVue();
      localVue.use(Vuex);
      store = createStore({
        strict: true,
        state: {},
      });
      done();
    });

    afterEach((done) => {
      layout.resetState();
      done();
    });

    test('changes "backgroundColor" value when "setBackgroundColor" is commited', () => {

      expect(layout.state.backgroundColor).toBe("red");
      expect(store.state.layout.backgroundColor).toBe("red");

      layout.mutations.setBackgroundColor("blue");

      expect(layout.state.backgroundColor).toBe("blue");
      expect(store.state.layout.backgroundColor).toBe("blue");

    });

    test('changes "stickyHeader" value when "toggleStickyHeader" is commited', () => {

      expect(layout.state.stickyHeader).toBeFalsy();
      expect(store.state.layout.stickyHeader).toBeFalsy();

      layout.mutations.toggleStickyHeader();

      expect(layout.state.stickyHeader).toBeTruthy();
      expect(store.state.layout.stickyHeader).toBeTruthy();

    });

    test('changes "backgroundColor" value to "red" when "loadBackgroundColor" is dispatched', async (done) => {

      layout.mutations.setBackgroundColor("blue");

      expect(layout.state.backgroundColor).toBe("blue");
      expect(store.state.layout.backgroundColor).toBe("blue");

      await layout.actions.loadBackgroundColor();

      expect(layout.state.backgroundColor).toBe("red");
      expect(store.state.layout.backgroundColor).toBe("red");

      done();

    });
  });
});