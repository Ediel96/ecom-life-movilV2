import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LifestyleExpense {
  id: string;
  name: string;
  icon: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  category: string;
  createdAt: string;
}

interface LifestyleState {
  expenses: LifestyleExpense[];
}

const initialState: LifestyleState = {
  expenses: [],
};

const lifestyleSlice = createSlice({
  name: 'lifestyle',
  initialState,
  reducers: {
    addLifestyleExpense: (state, action: PayloadAction<LifestyleExpense>) => {
      state.expenses.push(action.payload);
    },
    updateLifestyleExpense: (state, action: PayloadAction<LifestyleExpense>) => {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteLifestyleExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    },
  },
});

export const { addLifestyleExpense, updateLifestyleExpense, deleteLifestyleExpense } = lifestyleSlice.actions;
export default lifestyleSlice.reducer;
