import { applyMiddleware, createStore } from "redux";
import createSagaMiddleWare from "redux-saga";
import Logger from "redux-logger";
import { persistStore } from "redux-persist";

import RootReducer from "./reducer";
import RootSaga from "./saga";

const SagaMiddleware = createSagaMiddleWare();

const store = createStore(RootReducer, applyMiddleware(SagaMiddleware, Logger));

persistStore(store);

SagaMiddleware.run(RootSaga);

export default store;
