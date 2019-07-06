import { createLocalVue } from '@vue/test-utils';

import { createStore, defineModule } from "../src";
import { storedModules } from "../src/builder";

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
      delete storedModules.layout;
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

  describe('Nested Modules', () => {
    test("correctly nests modules", (done) => {
      const levelOne = defineModule("levelOne", _cloneDeep(state), {
        getters,
        mutations,
        actions,
      });
      const levelTwo = defineModule(["levelOne", "levelTwo"], _cloneDeep(state), {
        getters,
        mutations,
        actions,
      });
      const store = createStore({
        strict: true,
        state: {},
      });
      expect(store.state.levelOne).toBeDefined();
      expect(store.state.levelOne.levelTwo).toBeDefined();

      delete storedModules.levelOne;

      done();
    });
    test("gives meaningful error on missing parent", (done) => {
      expect(() => {
        defineModule(["levelOne", "levelTwo"], _cloneDeep(state), {
          getters,
          mutations,
          actions,
        });
      }).toThrow();

      done();
    });
  });
});