import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import type { MemberFilterParams, UserMember } from '@/types/member.type';
import { TUserStatus } from '@/types/user.type';
import { CreateUpdateMemberFormValues } from '@/validations/admin/create-update-member';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetMembers = ({
  search,
  packageId,
  status,
  page = 1,
  limit = 10,
}: MemberFilterParams) => {
  return useQuery({
    queryKey: ['members', search, packageId, status, page, limit],
    queryFn: async () => {
      const response = await api.get(API_URL.MEMBER.GET, {
        params: { search, packageId, status, page, limit },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data');
      }
      return response.data.data as { items: UserMember[]; total: number };
    },
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdateMemberFormValues) => {
      const response = await api.post(API_URL.MEMBER.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Omit<CreateUpdateMemberFormValues, 'email'> & { id: number }) => {
      const response = await api.put(API_URL.MEMBER.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(API_URL.MEMBER.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};
export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: TUserStatus }) => {
      const response = await api.patch(API_URL.MEMBER.UPDATE(id), { status });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
    },
  });
};
