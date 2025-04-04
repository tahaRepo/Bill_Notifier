import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import BillSlice from "./Slice/BillSlice"

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: [ 'BillSlice'],
  timeout:null
}

const rootReducer = combineReducers({
  BillSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const MyStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export const persistor = persistStore(MyStore)