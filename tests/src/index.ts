import Vuex from "vuex";
import { createStore } from "../../src";

import "./module";

const store = createStore({
  strict: true,
  state: {},
});

export default store;

export interface RootState {}