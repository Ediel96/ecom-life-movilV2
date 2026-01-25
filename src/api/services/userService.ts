import axiosInstance from '../axiosInstance';

interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },
};
