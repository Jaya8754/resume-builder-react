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
interface ServerResponse<T>{
  message: string;
  data: T
}


export interface SignupResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
};


export const useSignup = () => {
  return useMutation<ServerResponse<SignupResponse>, CustomError, SignupData>({
    mutationFn: signup,
  });
};