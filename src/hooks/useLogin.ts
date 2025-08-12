import api from '@/api/api';
import type { CustomError } from '../types/CustomError';
import { useMutation } from '@tanstack/react-query';

export interface LoginData {
  email: string;
  password: string;
}

const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};


export interface LoginResponse {
  // Add fields based on your API response, for example:
  token: string;
  user: {
    id: string;
    email: string;
    // add other user fields as needed
  };
}

export const useLogin = () => {
  return useMutation<LoginResponse, CustomError, LoginData>({
    mutationFn: login,
  });
};