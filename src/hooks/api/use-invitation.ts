import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { InvitationFilterParams } from '@/types/invitation.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useCreateInvitation() {
  return useMutation({
    mutationFn: async (data: CreateUpdateInvitationFormValues) => {
      const response = await api.post(API_URL.INVITATION.CREATE, data);
      return response.data.data;
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

export function useUpdateInvitation() {
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
  });
}
