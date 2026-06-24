import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { InvitationFilterParams } from '@/types/invitation.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useCreateInvitation() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
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
