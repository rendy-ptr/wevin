import { activityRepository } from '@/repositories/activity.repository';
import { invitationRepository } from '@/repositories/invitation.repository';
import { InvitationFilterParams } from '@/types/invitation.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';

export class InvitationService {
  async getAllInvitations(userId: number, params: InvitationFilterParams) {
    const memberProfile = await invitationRepository.checkMemberId(userId);
    if (!memberProfile) {
      return {
        data: [],
        meta: {
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10,
          totalPages: 0,
        },
      };
    }
    return await invitationRepository.getAll(memberProfile.id, params);
  }

  async createInvitation(
    userId: number,
    data: CreateUpdateInvitationFormValues,
  ) {
    const memberProfile = await invitationRepository.checkMemberId(userId);
    if (!memberProfile) {
      throw new Error(
        'Member profile not found. Please create a member profile first.',
      );
    }

    const slug = `${data.groomName}-${data.brideName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const payload = {
      ...data,
      slug,
    };

    const invitationId = await invitationRepository.createInvitation(
      memberProfile.id,
      payload,
    );

    await activityRepository.create({
      userId,
      action: 'CREATE',
      entityType: 'INVITATION',
      entityId: invitationId,
      details: `User created a new invitation (Slug: ${slug})`,
    });

    return {
      id: invitationId,
      slug,
    };
  }
}

export const invitationService = new InvitationService();
