import { RSVPStatusEnum } from '@/enums/invitation.enum';
import { invitationRSVPRepository } from '@/repositories/invitation-rsvp.repository';

export const invitationRSVPService = {
  submitPublicRSVP: async (payload: {
    invitationId: number;
    guestName: string;
    status: RSVPStatusEnum;
    guestCount?: number;
    reason?: string;
  }) => {
    return await invitationRSVPRepository.create(payload);
  },

  getByInvitationId: async (invitationId: number) => {
    return await invitationRSVPRepository.getByInvitationId(invitationId);
  },
};
