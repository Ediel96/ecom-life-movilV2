import axiosInstance from '../axiosInstance';

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string }): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/register', userData);
    return response.data;
  },
};
