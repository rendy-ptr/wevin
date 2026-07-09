import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { GuestFilterParams } from '@/types/guestbook.type';
import { CreateUpdateInvitationGuestFormValues } from '@/validations/member/create-update-guest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetInvitationGuests = (params: GuestFilterParams) => {
  return useQuery({
    queryKey: ['invitation-guests', params],
    queryFn: async () => {
      const response = await api.get(API_URL.GUEST.GET, {
        params,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data tamu');
      }
      return response.data.data;
    },
  });
};

export const useCreateInvitationGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdateInvitationGuestFormValues) => {
      const response = await api.post(API_URL.GUEST.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitation-guests'] });
    },
  });
};

export const useBulkCreateInvitationGuests = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUpdateInvitationGuestFormValues[]) => {
      const response = await api.post(API_URL.GUEST.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitation-guests'] });
    },
  });
};

export const useUpdateInvitationGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CreateUpdateInvitationGuestFormValues & { id: number }) => {
      const response = await api.put(API_URL.GUEST.UPDATE(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitation-guests'] });
    },
  });
};

export function useDeleteInvitationGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(API_URL.GUEST.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitation-guests'] });
    },
  });
}

export function useUpdatePublicGuestStatus() {
  return useMutation({
    mutationFn: async (data: {
      invitationId: number;
      guestName: string;
      status: string;
    }) => {
      const response = await api.post(API_URL.GUEST.UPDATE_PUBLIC_STATUS, data);
      return response.data;
    },
  });
}
