import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import {
  ForgotPasswordFormValues,
  LoginFormValues,
  ResetPasswordWithTokenFormValues,
} from '@/validations/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post(API_URL.AUTH.LOGIN, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(API_URL.AUTH.LOGOUT);
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await api.get(API_URL.AUTH.ME);
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      const response = await api.post(API_URL.AUTH.VERIFY_EMAIL, data);
      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Gagal mengirim link reset password',
        );
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forgot-password'] });
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ResetPasswordWithTokenFormValues) => {
      const response = await api.post(API_URL.AUTH.RESET_PASSWORD, data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal reset password');
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reset-password'] });
    },
  });
};
