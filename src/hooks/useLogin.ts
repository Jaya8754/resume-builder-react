import api from '@/lib/api';
import type { CustomError } from '../types/CustomError';
import { useMutation } from '@tanstack/react-query';

export interface LoginData {
  email: string;
  password: string;
}

const login = async (data: LoginData) => {
  try{
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useLogin = () => {
  return useMutation<any, CustomError, LoginData>({
    mutationFn: login,
  });
};