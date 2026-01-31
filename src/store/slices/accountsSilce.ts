import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AccountsState, Account } from '../../types';
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

const initialState: AccountsState = {
  list: [
    { 
      id: 1, 
      user_id: '', 
      name: 'Cash', 
      type: 'cash', 
      isActivated: true, 
      balance: 1250.50, 
      currency: 'COP', 
      account_type: 'cash', 
      bank_name: 'Cash',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { 
      id: 2, 
      user_id: '', 
      name: 'Bank Account', 
      type: 'bank', 
      isActivated: true, 
      balance: 5430.25, 
      currency: 'COP', 
      account_type: 'bank', 
      bank_name: 'Bancolombia',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { 
      id: 3, 
      user_id: '', 
      name: 'Debit Card', 
      type: 'debit', 
      isActivated: true, 
      balance: 320.75, 
      currency: 'COP', 
      account_type: 'debit', 
      bank_name: 'Davivienda',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { 
      id: 4, 
      user_id: '', 
      name: 'Savings', 
      type: 'saving', 
      isActivated: true, 
      balance: 12500.00, 
      currency: 'COP', 
      account_type: 'saving', 
      bank_name: 'Banco de Bogotá',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

// 🔥 Async Thunks para llamadas API
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (_, thunkAPI) => {
    try {
      console.log('🚀 Fetching accounts from API');
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
      const response = await api.accounts.getAll();
      const data = response.data;
      console.log('✅ Fetched accounts:', data);
      console.log('✅ Account count:', data?.length || 0);
      return data as Account[];
    } catch (error: any) {
      console.error('❌ Error fetching accounts:', error?.response?.data || error?.message || error);
      return thunkAPI.rejectWithValue('Failed to fetch accounts');
    }
  }
);

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await api.accounts.create(account);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al crear cuenta');
    }
  }
);

export const updateAccountThunk = createAsyncThunk(
  'accounts/updateAccount',
  async (account: Account, { rejectWithValue }) => {
    try {
      const response = await api.accounts.update(account.id, account);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al actualizar cuenta');
    }
  }
);

export const deleteAccountThunk = createAsyncThunk(
  'accounts/deleteAccount',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.accounts.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al eliminar cuenta');
    }
  }
);

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    // Reducers síncronos (opcional, para actualizaciones locales)
    addAccountLocal: (state, action: PayloadAction<Account>) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // 📥 Fetch Accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ➕ Create Account
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✏️ Update Account
    builder
      .addCase(updateAccountThunk.fulfilled, (state, action) => {
        const index = state.list.findIndex(acc => acc.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });

    // 🗑️ Delete Account
    builder
      .addCase(deleteAccountThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(acc => acc.id !== action.payload);
      });
  },
});

export const { addAccountLocal } = accountsSlice.actions;
export default accountsSlice.reducer;
