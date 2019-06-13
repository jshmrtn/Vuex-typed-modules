import Vue from "vue";
import Vuex from "vuex";
import { createStore } from "../../src";

import "./layout";

Vue.use(Vuex);

const store = createStore({
  strict: true,
  state: {},
});

export default store;
