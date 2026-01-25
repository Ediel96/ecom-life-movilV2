import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionsState, Transaction } from '../../types';

const initialState: TransactionsState = {
  list: [
    { id: '1', categoryId: '1', amount: 45000, description: 'Almuerzo', date: '2026-01-20', type: 'expense' },
    { id: '2', categoryId: '2', amount: 25000, description: 'Uber', date: '2026-01-20', type: 'expense' },
    { id: '3', categoryId: '1', amount: 80000, description: 'Supermercado', date: '2026-01-19', type: 'expense' },
    { id: '4', categoryId: '3', amount: 60000, description: 'Cine', date: '2026-01-18', type: 'expense' },
    { id: '5', categoryId: '4', amount: 120000, description: 'Farmacia', date: '2026-01-17', type: 'expense' },
    { id: '6', categoryId: '5', amount: 200000, description: 'Curso online', date: '2026-01-16', type: 'expense' },
    { id: '7', categoryId: '6', amount: 150000, description: 'Internet', date: '2026-01-15', type: 'expense' },
    { id: '8', categoryId: '2', amount: 35000, description: 'Gasolina', date: '2026-01-14', type: 'expense' },
  ],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list.unshift(action.payload);
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTransaction, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
