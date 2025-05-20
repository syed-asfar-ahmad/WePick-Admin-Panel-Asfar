import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import counterSlice from '../feature/counterSlice/counterSlice'
import specializationSlice from "../feature/specializationSlice";
import apiReducer from '../feature/AuthSlice'

const persistConfig = {
  key: "root",
  storage,
};
// Remove the non-serializable value from the persisted reducer
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    counter: counterSlice,
    specialization: specializationSlice.reducer,
    auth: apiReducer,
  })
);
export const store = configureStore({
  reducer: persistedReducer,
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for all actions
    }),
});
export const persistor = persistStore(store);