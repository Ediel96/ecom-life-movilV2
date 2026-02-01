import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import counterReducer from './slices/counterSlice';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import transactionsReducer from './slices/transactionsSlice';
import goalsReducer from './slices/goalsSlice';
import accountsReducer from './slices/accountsSilce';
import lifestyleReducer from './slices/lifestyleSlice';
import { apiSlice } from '../api/apiSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['counter', 'theme', 'auth', 'categories', 'transactions', 'goals', 'accounts', 'lifestyle'],
  blacklist: [],
};

// Configuración específica para auth - excluir token porque se guarda en SecureStore
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  blacklist: ['token'], // No persistir el token aquí, se guarda en SecureStore
};

const rootReducer = combineReducers({
  counter: counterReducer,
  theme: themeReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  categories: categoriesReducer,
  transactions: transactionsReducer,
  goals: goalsReducer,
  accounts: accountsReducer,
  lifestyle: lifestyleReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
