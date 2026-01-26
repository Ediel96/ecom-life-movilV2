import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const TOKEN_KEY = 'auth_token';

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
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to read token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
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