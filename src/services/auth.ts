import * as SecureStore from 'expo-secure-store';
import api from './api';

const TOKEN_KEY = 'token';

export interface LoginPayload {
  email?: string;
  password?: string;
  username?: string;
}

export interface RegisterPayload {
  [key: string]: any;
}

export interface AuthResult {
  data: any;
  token?: string | null;
}

export const saveToken = async (token: string): Promise<void> => {
  try {
    console.log('💾 Saving token to SecureStore:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log('✅ Token saved successfully');
  } catch (error) {
    console.error('❌ Failed to save token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('🔑 Retrieved token from SecureStore:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN FOUND');
    return token;
  } catch (error) {
    console.error('❌ Failed to read token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    console.log('🗑️ Removing token from SecureStore');
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log('✅ Token removed successfully');
  } catch (error) {
    console.error('❌ Failed to remove token:', error);
  }
};

export const login = async (
  { email, password, username }: LoginPayload = {}
): Promise<AuthResult> => {
  const body = username ? { username, password } : { email, password };
  const res = await api.auth.login(body);
  const token: string | undefined = res?.data?.token || res?.data?.accessToken;
  return { data: res.data, token: token ?? null };
};

export const register = async (payload: RegisterPayload): Promise<AuthResult> => {
  const res = await api.auth.register(payload);
  const token: string | undefined = res?.data?.token || res?.data?.accessToken;
  return { data: res.data, token: token ?? null };
};