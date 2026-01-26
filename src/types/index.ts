export interface Category {
  id: number;
  key: string;
  name: string;
  icon: string;
  color_fill: string;
  color_bg: string;
  transaction_type: 'expense' | 'income';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  user_id: string;
  category_id: number;
  amount: number;
  transaction_type: 'expense' | 'income';
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface CounterState {
  value: number;
}

export interface CategoriesState {
  list: Category[];
  loading: boolean;
  error: string | null;
}

export interface TransactionsState {
  list: Transaction[];
  loading: boolean;
  error: string | null;
}

export interface Account {
  id: number;
  user_id: string;
  name: string;
  type: string;
  isActivated: boolean;
  balance: number;
  currency: string;
  account_type: string;
  bank_name: string;
  created_at: string;
  updated_at: string;
}

export interface AccountsState {
  list: Account[];
  loading: boolean;
  error: string | null;
}
