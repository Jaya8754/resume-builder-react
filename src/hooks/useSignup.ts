import api from '@/api/api';
import type { CustomError } from '@/types/CustomError';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const signup = async (data: SignupData) => {
  try{
    const response = await api.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    throw error as AxiosError
  }
};

export const useSignup = () => {
  return useMutation<any, CustomError, SignupData>({
    mutationFn: signup,
  });
};