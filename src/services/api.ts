import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as auth from './auth';

// URLs base para diferentes servicios
const API_URLS = {
  AUTH: 'http://localhost:8082',     // Servicio de autenticación y tokens
  MAIN: 'http://localhost:8080',     // Servicios principales (expenses, accounts, etc.)
};

// Configuración común para ambas instancias
const defaultConfig: AxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 10000,
};

// Instancia para servicios de autenticación (puerto 8081)
const authApi = axios.create({
  baseURL: API_URLS.AUTH,
  ...defaultConfig,
});

// Instancia para servicios principales (puerto 8080)
const mainApi = axios.create({
  baseURL: API_URLS.MAIN,
  ...defaultConfig,
});

// Interceptor de debug para ambas instancias
const debugInterceptor = (config: InternalAxiosRequestConfig) => config;

authApi.interceptors.request.use((cfg) => debugInterceptor(cfg));
mainApi.interceptors.request.use((cfg) => debugInterceptor(cfg));

// Interceptor para adjuntar token (solo para servicios principales)
const tokenInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = await auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Solo mainApi necesita el token (authApi maneja su propia autenticación)
mainApi.interceptors.request.use(tokenInterceptor, (err) => Promise.reject(err));

// Interceptor de respuesta para manejo de 401
const responseInterceptor = (res: AxiosResponse) => res;
const errorInterceptor = async (error: any) => {
  if (error?.response?.status === 401) {
    // Limpia token y opcionalmente redirige
    await auth.removeToken();
    // Puedes emitir un evento o usar window.location = '/login'
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use(responseInterceptor, errorInterceptor);
mainApi.interceptors.response.use(responseInterceptor, errorInterceptor);

// Objeto API organizado por servicios
const api = {
  // Servicios de autenticación (puerto 8081)
  auth: {
    login: (credentials: any) => authApi.post('/auth/login', credentials),
    register: (userData: any) => authApi.post('/auth/register', userData),
    refreshToken: () => authApi.post('/auth/refresh'),
    logout: () => authApi.post('/auth/logout'),
  },
  
  // Servicios principales (puerto 8080)
  transactions: {
    getAll: (queryParams = '') => {
      const url = queryParams ? `/api/transactions?${queryParams}` : '/api/transactions';
      return mainApi.get(url);
    },
    create: (transaction: any) => mainApi.post('/api/transactions', transaction),
    update: (id: string | number, transaction: any) => mainApi.put(`/api/transactions/${id}`, transaction),
    delete: (id: string | number) => mainApi.delete(`/api/transactions/${id}`),
    getById: (id: string | number) => mainApi.get(`/api/transactions/${id}`),
  },

  categories: {
    getAll: () => mainApi.get('/api/categories'),
    create: (category: any) => mainApi.post('/api/categories', category),
    update: (id: string | number, category: any) => mainApi.put(`/api/categories/${id}`, category),
    delete: (id: string | number) => mainApi.delete(`/api/categories/${id}`),
    getFindByUser: (queryParams = '') => {
      const url = queryParams ? `/api/accounts?${queryParams}` : '/api/accounts';
      return mainApi.get(url);
    },
  },

  accounts: {
    getAll: () => mainApi.get('/api/accounts'),
    create: (account: any) => mainApi.post('/api/accounts', account),
    update: (id: string | number, account: any) => mainApi.put(`/api/accounts/${id}`, account),
    delete: (id: string | number) => mainApi.delete(`/api/accounts/${id}`),
    getById: (id: string | number) => mainApi.get(`/api/accounts/${id}`),
    getFindByEnum: (queryParams = '') => {
      const url = queryParams ? `/api/accounts?${queryParams}` : '/api/accounts';
      return mainApi.get(url);
    },
  },

  expenses: {
    getAll: (params?: any) => mainApi.get('/api/expenses', { params }),
    create: (expense: any) => mainApi.post('/api/expenses', expense),
    update: (id: string | number, expense: any) => mainApi.put(`/api/expenses/${id}`, expense),
    delete: (id: string | number) => mainApi.delete(`/api/expenses/${id}`),
    getById: (id: string | number) => mainApi.get(`/api/expenses/${id}`),
  },
  
  income: {
    getAll: (params?: any) => mainApi.get('/api/income', { params }),
    create: (income: any) => mainApi.post('/api/income', income),
    update: (id: string | number, income: any) => mainApi.put(`/api/income/${id}`, income),
    delete: (id: string | number) => mainApi.delete(`/api/income/${id}`),
  },
  
  goals: {
    getAll: () => mainApi.get('/api/goals'),
    create: (goal: any) => mainApi.post('/api/goals', goal),
    update: (id: string | number, goal: any) => mainApi.put(`/api/goals/${id}`, goal),
    delete: (id: string | number) => mainApi.delete(`/api/goals/${id}`),
  },
  
  reports: {
    getExpensesByPeriod: (params?: any) => mainApi.get('/api/reports/expenses', { params }),
    getIncomesByPeriod: (params?: any) => mainApi.get('/api/reports/income', { params }),
    getSummary: (params?: any) => mainApi.get('/api/reports/summary', { params }),
  }
};

// Exportar instancias individuales para casos especiales
export { authApi, mainApi };

// Exportar API organizada por defecto
export default api;