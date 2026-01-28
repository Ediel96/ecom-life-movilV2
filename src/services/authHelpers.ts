import * as SecureStore from 'expo-secure-store';
import { AxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'token';

// Helper reutilizable para obtener el header Authorization
export const getAuthHeaders = async (): Promise<AxiosRequestConfig['headers']> => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  console.log('🔑 getAuthHeaders token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
