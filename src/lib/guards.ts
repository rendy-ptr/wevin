import { NotFoundError } from '@/lib/errors';
import { invitationGuestRepository } from '@/repositories/invitation-guest.repository';
import { invitationRepository } from '@/repositories/invitation.repository';
import { memberRepository } from '@/repositories/member.repository';

export const guards = {
  checkMemberProfile: async (userId: number) => {
    const memberProfile = await memberRepository.findMemberProfile(userId);
    if (!memberProfile) {
      throw new NotFoundError(
        'Member profile not found. Please create a member profile first.',
      );
    }
    return memberProfile;
  },

  checkInvitationAccess: async (
    invitationId: number,
    memberProfileId: number,
  ) => {
    const invitation = await invitationRepository.getById(invitationId);
    if (!invitation || invitation.memberId !== memberProfileId) {
      throw new NotFoundError('Invitation not found or unauthorized access.');
    }
    return invitation;
  },

  checkGuestExist: async (id: number) => {
    const guest = await invitationGuestRepository.findById(id);
    if (!guest) {
      throw new NotFoundError('Tamu tidak ditemukan');
    }
    return guest;
  },
};
