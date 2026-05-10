import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { LoginFormValues } from '@/validations/auth';
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
