import { API_URL } from '@/constants/url';
import api from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSubmitPublicWish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      invitationId: number;
      guestName: string;
      message: string;
    }) => {
      const response = await api.post(API_URL.WISH.SUBMIT_PUBLIC, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitation-guests'] });
    },
  });
}
