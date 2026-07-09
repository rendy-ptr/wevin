import { invitationWishesRepository } from '@/repositories/invitation-wishes.repository';

export const invitationWishesService = {
  submitPublicWish: async (payload: {
    invitationId: number;
    guestName: string;
    message: string;
  }) => {
    return await invitationWishesRepository.create(payload);
  },

  getByInvitationId: async (invitationId: number) => {
    return await invitationWishesRepository.getByInvitationId(invitationId);
  },
};
