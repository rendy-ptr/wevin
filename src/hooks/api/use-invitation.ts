import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { InvitationFilterParams } from '@/types/invitation.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdateInvitationFormValues) => {
      const response = await api.post(API_URL.INVITATION.CREATE, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

export function useGetInvitations(params?: InvitationFilterParams) {
  return useQuery({
    queryKey: ['invitations', params],
    queryFn: async () => {
      const response = await api.get(API_URL.INVITATION.GET, { params });
      return response.data.data;
    },
  });
}

export function useGetInvitationOptions() {
  return useQuery({
    queryKey: ['invitation-options'],
    queryFn: async () => {
      const response = await api.get(API_URL.INVITATION.GET_OPTIONS);
      return response.data.data as {
        id: number;
        groomName: string;
        brideName: string;
      }[];
    },
  });
}

export function useGetInvitationById(id: number) {
  return useQuery({
    queryKey: ['invitation', id],
    queryFn: async () => {
      const response = await api.get(API_URL.INVITATION.GET_BY_ID(id));
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useGetPublicInvitationBySlug(slug: string) {
  return useQuery({
    queryKey: ['invitation-public', slug],
    queryFn: async () => {
      const response = await api.get(
        API_URL.INVITATION.GET_PUBLIC_BY_SLUG(slug),
      );
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function useUpdateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateUpdateInvitationFormValues;
    }) => {
      const response = await api.put(API_URL.INVITATION.UPDATE(id), data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(API_URL.INVITATION.DELETE(id));
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal menghapus undangan');
      }
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
};
