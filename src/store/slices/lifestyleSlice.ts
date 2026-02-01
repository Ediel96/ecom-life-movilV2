import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';

// Transacción recurrente extiende Transaction con frequency obligatorio
export interface RecurringTransaction extends Omit<Transaction, 'frequency' | 'isRecurring'> {
  frequency: 'monthly' | 'weekly' | 'yearly';
  isRecurring: true;
}

interface LifestyleState {
  // Lista de IDs de transacciones que son recurrentes
  recurringTransactionIds: number[];
  // Configuración de frecuencia por transacción
  frequencyConfig: {
    [transactionId: number]: {
      frequency: 'monthly' | 'weekly' | 'yearly';
      lastExecuted?: string;
      nextExecution?: string;
    };
  };
}

const initialState: LifestyleState = {
  recurringTransactionIds: [],
  frequencyConfig: {},
};

const lifestyleSlice = createSlice({
  name: 'lifestyle',
  initialState,
  reducers: {
    // Marcar una transacción como recurrente
    setTransactionAsRecurring: (state, action: PayloadAction<{
      transactionId: number;
      frequency: 'monthly' | 'weekly' | 'yearly';
    }>) => {
      const { transactionId, frequency } = action.payload;
      if (!state.recurringTransactionIds.includes(transactionId)) {
        state.recurringTransactionIds.push(transactionId);
      }
      state.frequencyConfig[transactionId] = {
        frequency,
        lastExecuted: new Date().toISOString(),
      };
    },
    
    // Actualizar frecuencia de una transacción recurrente
    updateRecurringFrequency: (state, action: PayloadAction<{
      transactionId: number;
      frequency: 'monthly' | 'weekly' | 'yearly';
    }>) => {
      const { transactionId, frequency } = action.payload;
      if (state.frequencyConfig[transactionId]) {
        state.frequencyConfig[transactionId].frequency = frequency;
      }
    },
    
    // Quitar la marca de recurrente de una transacción
    removeRecurringTransaction: (state, action: PayloadAction<number>) => {
      const transactionId = action.payload;
      state.recurringTransactionIds = state.recurringTransactionIds.filter(id => id !== transactionId);
      delete state.frequencyConfig[transactionId];
    },
    
    // Limpiar todas las transacciones recurrentes
    clearRecurringTransactions: (state) => {
      state.recurringTransactionIds = [];
      state.frequencyConfig = {};
    },
  },
});

export const { 
  setTransactionAsRecurring, 
  updateRecurringFrequency, 
  removeRecurringTransaction,
  clearRecurringTransactions 
} = lifestyleSlice.actions;

export default lifestyleSlice.reducer;
