import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
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

// Migraciones para lifestyle slice (de expenses a recurringTransactionIds)
const lifestyleMigrations = {
  0: (state: any) => {
    // Migración de la estructura antigua a la nueva
    return {
      recurringTransactionIds: [],
      frequencyConfig: {},
    };
  },
};

const lifestylePersistConfig = {
  key: 'lifestyle',
  storage: AsyncStorage,
  version: 1,
  migrate: createMigrate(lifestyleMigrations, { debug: false }),
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['counter', 'theme', 'auth', 'categories', 'transactions', 'goals', 'accounts'],
  blacklist: ['lifestyle'], // lifestyle tiene su propio persistConfig
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
  lifestyle: persistReducer(lifestylePersistConfig, lifestyleReducer),
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
