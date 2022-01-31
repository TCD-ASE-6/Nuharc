import rootReducer from "./reducers";
import { createStore } from "redux";

const initialState = {};

// dummy store for unit and integration tests.
export const TestStore = createStore(
  rootReducer,
  initialState
);