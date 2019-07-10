import { createStore, defineModule, defineDynamicModule } from "../src";
import { resetStoredModules } from "../src/builder";

import Vuex from 'vuex';

import { actions, getters, mutations, state } from "./src/module";

import _cloneDeep from "lodash/cloneDeep";

beforeEach((done) => {
  resetStoredModules();
  done();
});

describe("Store", () => {

  Object.entries({ static: defineModule, dynamic: defineDynamicModule}).forEach(([name, constructor]) => {

    describe(`${name}: Base Capabilities`, () => {
      let module;
      let localVue;
      let store;

      beforeEach((done) => {
        module = constructor("module", state, {
          getters,
          mutations,
          actions,
        });

        store = createStore({
          strict: true,
          state: {},
        });

        if (constructor === defineDynamicModule) {
          module.register();
        }

        done();

      });

      afterEach((done) => {
        module.resetState();

        if (constructor === defineDynamicModule) {
          module.unregister();
        }

        done();
      });

      test('changes "property" value when "setProperty" is commited', () => {

        expect(module.state.property).toBe("red");
        expect(store.state.module.property).toBe("red");
        expect(module.getters.property).toBe("red");

        module.mutations.setProperty("blue");

        expect(module.state.property).toBe("blue");
        expect(store.state.module.property).toBe("blue");
        expect(module.getters.property).toBe("blue");

      });
      
      test('changes "property" value to "red" when "load" is dispatched', async (done) => {

        module.mutations.setProperty("blue");

        expect(module.state.property).toBe("blue");
        expect(store.state.module.property).toBe("blue");

        await module.actions.load();

        expect(module.state.property).toBe("red");
        expect(store.state.module.property).toBe("red");

        done();

      });

      test('reactivity', async (done) => {
        const spy = jest.fn();

        store.watch(
          (_state, getters) => getters['module/property'],
          spy
        );

        module.mutations.setProperty("blue");

        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        expect(spy).toHaveBeenCalledWith("blue", "red");

        done();
      });

    });

  });

  describe('resetState', () => {
    test('resetState correctly resets state in static module', async (done) => {

      const module = defineModule("module", state, {
        getters,
        mutations,
        actions,
      });

      createStore({
        strict: true,
        state: {},
      });

      module.mutations.setProperty("blue");

      expect(module.state.property).toBe("blue");

      module.resetState();

      expect(module.state.property).toBe("red");

      module.resetState();

      done();
    });

    test('resetState correctly resets state in dynamic module', async (done) => {

      const module = defineDynamicModule("module", state, {
        getters,
        mutations,
        actions,
      });

      createStore({
        strict: true,
        state: {},
      });

      module.register();

      expect(module.state.property).toBe("red");

      module.mutations.setProperty("blue");

      expect(module.state.property).toBe("blue");

      module.resetState();

      expect(module.state.property).toBe("red");

      module.unregister();

      done();

    });

  });

  describe('Nested Modules', () => {
    test("correctly nests modules", (done) => {
      const levelOne = defineModule("levelOne", state, {
        getters,
        mutations,
        actions,
      });
      const levelTwo = defineModule(["levelOne", "levelTwo"], state, {
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

      done();
    });
    test("gives meaningful error on missing parent", (done) => {
      expect(() => {
        defineModule(["levelOne", "levelTwo"], state, {
          getters,
          mutations,
          actions,
        });

        createStore({
          strict: true,
          state: {},
        });
      }).toThrow();

      done();
    });
    test("works in wrong direction", (done) => {
      expect(() => {
        defineModule(["levelOne", "levelTwo"], state, {
          getters,
          mutations,
          actions,
        });

        defineModule("levelOne", state, {
          getters,
          mutations,
          actions,
        });

        createStore({
          strict: true,
          state: {},
        });
      }).not.toThrow();

      done();
    });
    test("works with dynamic module", (done) => {
      expect(() => {
        defineModule("levelOne", state, {
          getters,
          mutations,
          actions,
        });

        defineDynamicModule(["levelOne", "levelTwo"], state, {
          getters,
          mutations,
          actions,
        });

        createStore({
          strict: true,
          state: {},
        });
      }).not.toThrow();

      done();
    });
  });
});
