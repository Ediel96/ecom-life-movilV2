import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as auth from './auth';
import { getAuthHeaders } from './authHelpers';

// URLs base para diferentes servicios
const API_URLS = {
  AUTH: 'http://localhost:8082',     // Servicio de autenticación y tokens
  MAIN: 'http://localhost:8080',     // Servicios principales (expenses, accounts, etc.)
};

// Obtener token de forma inicial (si es necesario)

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
  console.log('🔑 Token retrieved:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  if (token) {
    const authHeader = `Bearer ${token}`;
    const headersAny = config.headers as any;
    if (headersAny?.set && typeof headersAny.set === 'function') {
      headersAny.set('Authorization', authHeader);
    } else {
      config.headers = { ...(headersAny || {}), Authorization: authHeader } as any;
    }
    console.log('📤 Request to:', config.url, 'with Authorization header');
  } else {
    console.log('⚠️ No token found, request to:', config.url);
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
    
    // Opcional: pasar filtros como objeto y/o headers (token ya lo añade el interceptor)
    getAll: (options?: {
      page?: number;
      size?: number;
      sort?: string;
      user_id?: string;
      account_id?: string | number;
      category_id?: string | number;
      transaction_type?: string;
      date_from?: string;
      date_to?: string;
      params?: Record<string, any>;
      headers?: AxiosRequestConfig['headers'],
      [key: string]: any;
    }) => {
      const {
        headers,
        params: extraParams,
        page,
        size,
        sort,
        user_id,
        account_id,
        category_id,
        transaction_type,
        date_from,
        date_to,
        ...rest
      } = options || {};

      const params: Record<string, any> = { ...(extraParams || {}) };
      if (page !== undefined) params.page = page;
      if (size !== undefined) params.size = size;
      if (sort !== undefined) params.sort = sort;
      if (user_id !== undefined) params.user_id = user_id;
      if (account_id !== undefined) params.account_id = account_id;
      if (category_id !== undefined) params.category_id = category_id;
      if (transaction_type !== undefined) params.transaction_type = transaction_type;
      if (date_from !== undefined) params.date_from = date_from;
      if (date_to !== undefined) params.date_to = date_to;
      // merge any other custom filters
      Object.assign(params, rest);

      return mainApi.get('/api/transactions', { params, headers });
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
export { authApi, mainApi, getAuthHeaders };

// Exportar API organizada por defecto
export default api;