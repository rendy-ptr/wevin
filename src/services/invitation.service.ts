import { NotFoundError } from '@/lib/errors';
import { guards } from '@/lib/guards';
import { activityRepository } from '@/repositories/activity.repository';
import { invitationRepository } from '@/repositories/invitation.repository';
import { InvitationFilterParams } from '@/types/invitation.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';

export const invitationService = {
  getAllInvitations: async function (
    userId: number,
    params: InvitationFilterParams,
  ) {
    const memberProfile = await guards.checkMemberProfile(userId);

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

  getInvitationOptions: async function (userId: number) {
    const memberProfile = await guards.checkMemberProfile(userId);

    return await invitationRepository.getOptions(memberProfile.id);
  },

  getInvitationById: async function (id: number, userId: number) {
    const memberProfile = await guards.checkMemberProfile(userId);
    const invitation = await guards.checkInvitationAccess(id, memberProfile.id);

    return {
      ...invitation,
      ...invitation.wording,
      events: invitation.invitationEvents,
      gallery: invitation.invitationGallery,
    };
  },

  getPublicInvitationBySlug: async (slug: string) => {
    const invitation = await invitationRepository.getBySlug(slug);
    if (!invitation) {
      throw new NotFoundError('Invitation not found.');
    }
    return {
      ...invitation,
      ...invitation.wording,
      events: invitation.invitationEvents,
      gallery: invitation.invitationGallery,
    };
  },

  createInvitation: async function (
    userId: number,
    data: CreateUpdateInvitationFormValues,
  ) {
    const memberProfile = await guards.checkMemberProfile(userId);

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

  updateInvitation: async function (
    invitationId: number,
    userId: number,
    data: CreateUpdateInvitationFormValues,
  ) {
    const memberProfile = await guards.checkMemberProfile(userId);
    await guards.checkInvitationAccess(invitationId, memberProfile.id);

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

  deleteInvitation: async function (id: number, userId: number) {
    const memberProfile = await guards.checkMemberProfile(userId);
    const existingInvitation = await guards.checkInvitationAccess(
      id,
      memberProfile.id,
    );

    const result = await invitationRepository.deleteInvitation(id);

    await activityRepository.create({
      userId,
      action: 'DELETE',
      entityType: 'INVITATION',
      entityId: id,
      details: `User deleted invitation ${existingInvitation.groomName} - ${existingInvitation.brideName}`,
    });

    return result;
  },
};
