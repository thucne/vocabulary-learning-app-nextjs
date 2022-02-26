import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "@reducers";

const middleware = [thunk];

const makeStore = createStore(
    rootReducer,
    compose(applyMiddleware(...middleware))
);

export const store = makeStore;
