import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { ActivityFilterParams, ActivityIndexItem } from '@/types/activity.type';
import { BaseUserModel } from '@/types/user.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// export const useGetSettings = () => {
//   return useQuery({
//     queryKey: ['settings'],
//     queryFn: async () => {
//       const response = await api.get(API_URL.SETTING.GET);
//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Gagal mengambil data');
//       }
//       return response.data.data as UserWithRelationships;
//     },
//   });
// };

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      password,
      oldPassword,
      confirmPassword,
    }: Pick<BaseUserModel, 'id' | 'password'> & {
      oldPassword: string;
      confirmPassword: string;
    }) => {
      const response = await api.patch(API_URL.SETTING.UPDATE_PASSWORD(id), {
        password,
        oldPassword,
        confirmPassword,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', variables.id] });
    },
  });
};

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      email,
      verificationToken,
      otpCode,
    }: Pick<BaseUserModel, 'id' | 'email'> & {
      verificationToken?: string;
      otpCode?: string;
    }) => {
      const response = await api.patch(API_URL.SETTING.UPDATE_EMAIL(id), {
        email,
        verificationToken,
        otpCode,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};

export const useUpdateName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: Pick<BaseUserModel, 'id' | 'name'>) => {
      const response = await api.patch(API_URL.SETTING.UPDATE_NAME(id), {
        name,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};

export const useGetAllActivityLogs = ({
  userId,
  search,
  startDate,
  endDate,
  action,
  page,
  limit,
}: ActivityFilterParams) => {
  return useQuery({
    queryKey: [
      'settings',
      'activity-logs',
      userId,
      search,
      startDate,
      endDate,
      action,
      page,
      limit,
    ],
    queryFn: async () => {
      const response = await api.get(API_URL.SETTING.GET_ALL_ACTIVITY_LOGS, {
        params: { userId, search, startDate, endDate, action, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as {
        items: ActivityIndexItem[];
        total: number;
      };
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await api.post(API_URL.SETTING.SEND_OTP, { email });
      return response.data;
    },
  });
};
