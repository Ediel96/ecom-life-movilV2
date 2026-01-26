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
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
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
}
