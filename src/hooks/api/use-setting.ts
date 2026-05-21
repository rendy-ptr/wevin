import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { ActivityFilterParams, TActivityLog } from '@/types/activity.type';
import { TUser, TUserRelated } from '@/types/user.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get(API_URL.SETTING.GET);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as TUserRelated;
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      password,
      oldPassword,
      confirmPassword,
    }: Pick<TUser, 'id' | 'password'> & {
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

export const useUpdateNameAndEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      email,
    }: Pick<TUser, 'id' | 'name' | 'email'>) => {
      const response = await api.patch(API_URL.SETTING.UPDATE_NAME_EMAIL(id), {
        name,
        email,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', variables.id] });
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
      return response.data.data as { items: TActivityLog[]; total: number };
    },
  });
};
