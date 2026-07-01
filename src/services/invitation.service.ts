import { db } from '@/db';
import { invitations } from '@/db/table/invitation/invitations.table';
import { activityRepository } from '@/repositories/activity.repository';
import { invitationRepository } from '@/repositories/invitation.repository';
import { InvitationFilterParams } from '@/types/invitation.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { eq } from 'drizzle-orm';

export const invitationService = {
  getAllInvitations: async (userId: number, params: InvitationFilterParams) => {
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
    const [quota] = await invitationRepository.getActiveDaysQuota(
      memberProfile.id,
    );

    const activeDays = quota?.activeDays ? Number(quota.activeDays) : null;

    const { data, meta } = await invitationRepository.getAll(
      memberProfile.id,
      params,
    );

    const formattedData = data.map((invitation) => {
      let expiredText = '-';

      if (!invitation.publishedAt) {
        expiredText = 'Belum tayang';
      } else if (activeDays) {
        const publishedDate = new Date(invitation.publishedAt);
        const expirationDate = new Date(
          publishedDate.getTime() + activeDays * 24 * 60 * 60 * 1000,
        );
        const diffTime = expirationDate.getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        expiredText = diffDays > 0 ? `${diffDays} hari lagi` : 'Kadaluarsa';
      }

      return {
        ...invitation,
        expiredText,
      };
    });

    return { data: formattedData, meta };
  },

  getInvitationById: async (id: number, userId: number) => {
    const memberProfile = await invitationRepository.checkMemberId(userId);
    if (!memberProfile) {
      throw new Error('Member profile not found.');
    }

    const invitation = await invitationRepository.getById(id);

    if (!invitation || invitation.memberId !== memberProfile.id) {
      throw new Error('Invitation not found or unauthorized access.');
    }

    return {
      ...invitation,
      ...invitation.wording,
      events: invitation.invitationEvents,
      gallery: invitation.invitationGallery,
    };
  },

  createInvitation: async (
    userId: number,
    data: CreateUpdateInvitationFormValues,
  ) => {
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
  },

  updateInvitation: async (
    invitationId: number,
    userId: number,
    data: CreateUpdateInvitationFormValues,
  ) => {
    const memberProfile = await invitationRepository.checkMemberId(userId);

    if (!memberProfile) {
      throw new Error(
        'Member profile not found. Please create a member profile first.',
      );
    }

    const existingInvitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, invitationId),
    });

    if (
      !existingInvitation ||
      existingInvitation.memberId !== memberProfile.id
    ) {
      throw new Error('Invitation not found or unauthorized');
    }

    const slug = `${data.groomName}-${data.brideName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const payload = {
      ...data,
      slug,
    };

    await invitationRepository.updateInvitation(invitationId, payload);

    await activityRepository.create({
      userId,
      action: 'UPDATE',
      entityType: 'INVITATION',
      entityId: invitationId,
      details: `User updated invitation (Slug: ${slug})`,
    });

    return {
      id: invitationId,
      slug,
    };
  },
};
