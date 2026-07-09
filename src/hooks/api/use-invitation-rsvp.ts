import { API_URL } from '@/constants/url';
import { RSVPStatusEnum } from '@/enums/invitation.enum';
import api from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSubmitPublicRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      invitationId: number;
      guestName: string;
      status: RSVPStatusEnum;
      guestCount?: number;
      reason?: string;
    }) => {
      const response = await api.post(API_URL.RSVP.SUBMIT_PUBLIC, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitation-guests'] });
    },
  });
}
