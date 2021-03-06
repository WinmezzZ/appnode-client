import { combineReducers, configureStore } from '@reduxjs/toolkit';

import globalReducer from './global.store';
import userReducer from './user.store';

const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;
