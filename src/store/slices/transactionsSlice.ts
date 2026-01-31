import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TransactionsState, Transaction } from '../../types';
import api from '../../services/api';
import { getAuthHeaders } from '../../services/authHelpers';
import { jwtDecode } from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

interface JwtPayload {
  role: string;
  name: string;
  userId: string;
  sub: string;
  iat: number;
  exp: number;
}

const initialState: TransactionsState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, thunkAPI) => {
    try {
      // Get token and decode to extract userId
      console.log('🚀 Fetching transactions from API');
      const token = await SecureStore.getItemAsync('token');
      
      if (!token) {
        console.error('❌ No token found');
        return thunkAPI.rejectWithValue('No token found');
      }

      // Decode JWT to get userId
      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.userId;
      console.log('👤 User ID from token:', userId);

      const headers = await getAuthHeaders();
      console.log('🔍 Using headers:', headers);
      
      // Call API with user_id parameter
      const response = await api.transactions.getAll({ 
        user_id: userId,
        headers 
      });
      const data = response.data.content;
      console.log('✅ Fetched transactions:', data);
      console.log('✅ Transaction count:', data?.length || 0);
      return data as Transaction[];
    } catch (error: any) {
      console.error('❌ Error fetching transactions:', error?.response?.data || error?.message || error);
      return thunkAPI.rejectWithValue('Failed to fetch transactions');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>, thunkAPI) => {
    try {
      const response = await api.transactions.create(transaction);
      return response.data as Transaction;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to create transaction');
    }
  }
);

export const updateTransactionThunk = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: Transaction, thunkAPI) => {
    try {
      const response = await api.transactions.update(transaction.id, transaction);
      return response.data as Transaction;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to update transaction');
    }
  }
);

export const deleteTransactionThunk = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: number, thunkAPI) => {
    try {
      await api.transactions.delete(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete transaction');
    }
  }
);  


const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransactionLocal: (state, action: PayloadAction<Transaction>) => {
      state.list.unshift(action.payload);
    },
    deleteTransactionLocal: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // 📥 Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ➕ Create Transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✏️ Update Transaction
    builder
      .addCase(updateTransactionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateTransactionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🗑️ Delete Transaction
    builder
      .addCase(deleteTransactionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTransactionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addTransactionLocal, deleteTransactionLocal } = transactionsSlice.actions;
export default transactionsSlice.reducer;
