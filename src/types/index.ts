export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
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
}

export interface TransactionsState {
  list: Transaction[];
}
