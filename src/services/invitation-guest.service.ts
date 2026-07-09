import { GuestStatusEnum } from '@/enums/invitation.enum';
import { DuplicateError } from '@/lib/errors';
import { guards } from '@/lib/guards';
import { invitationGuestRepository } from '@/repositories/invitation-guest.repository';
import { activityService } from '@/services/activity.service';
import { GuestFilterParams } from '@/types/guestbook.type';
import { CreateUpdateInvitationGuestFormValues } from '@/validations/member/create-update-guest';

export const invitationGuestService = {
  checkDuplicate: async (invitationId: number, guestName: string) => {
    const existing = await invitationGuestRepository.findExactMatch(
      invitationId,
      guestName,
    );

    if (existing) {
      throw new DuplicateError(
        `Nama "${guestName}" sudah ada di daftar tamu ini.`,
      );
    }
  },

  getAll: async (userId: number, params: GuestFilterParams) => {
    const memberProfile = await guards.checkMemberProfile(userId);
    return await invitationGuestRepository.getAll(memberProfile.id, params);
  },

  create: async (
    payload: CreateUpdateInvitationGuestFormValues,
    userId?: number,
  ) => {
    await invitationGuestService.checkDuplicate(
      payload.invitationId,
      payload.guestName,
    );
    const guest = await invitationGuestRepository.create(payload);
    if (userId) {
      await activityService.log({
        userId,
        action: 'CREATE',
        entityType: 'GUEST',
        entityId: guest.id,
        details: `Menambahkan tamu: ${guest.guestName}`,
      });
    }
    return guest;
  },

  createMany: async (
    payloads: CreateUpdateInvitationGuestFormValues[],
    userId?: number,
  ) => {
    if (!payloads.length) return [];

    const validPayloads: CreateUpdateInvitationGuestFormValues[] = [];

    for (const payload of payloads) {
      const existing = await invitationGuestRepository.findExactMatch(
        payload.invitationId,
        payload.guestName,
      );
      const isDuplicateInArray = validPayloads.some(
        (p) => p.guestName.toLowerCase() === payload.guestName.toLowerCase(),
      );
      if (!existing && !isDuplicateInArray) {
        validPayloads.push(payload);
      }
    }
    if (!validPayloads.length) return [];

    const guests = await invitationGuestRepository.createMany(validPayloads);
    if (userId) {
      await activityService.log({
        userId,
        action: 'CREATE',
        entityType: 'GUEST',
        entityId: 0,
        details: `Import ${guests.length} tamu untuk undangan ID: ${validPayloads[0]?.invitationId}`,
      });
    }
    return guests;
  },

  export: async (userId: number) => {
    const memberProfile = await guards.checkMemberProfile(userId);

    const data = await invitationGuestRepository.export(memberProfile.id);

    if (userId) {
      await activityService.log({
        userId: userId,
        action: 'EXPORT',
        entityType: 'GUEST',
        entityId: 0,
        details: `Export ${data.length} tamu untuk semua undangan`,
      });
    }

    return data;
  },

  update: async (
    id: number,
    payload: CreateUpdateInvitationGuestFormValues,
    userId?: number,
  ) => {
    await guards.checkGuestExist(id);
    await invitationGuestService.checkDuplicate(
      payload.invitationId,
      payload.guestName,
    );
    const updated = await invitationGuestRepository.update(id, payload);
    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'GUEST',
        entityId: id,
        details: `Memperbarui tamu: ${updated.guestName}`,
      });
    }
    return updated;
  },

  delete: async (id: number, userId?: number) => {
    const existing = await guards.checkGuestExist(id);
    const deleted = await invitationGuestRepository.delete(id);
    if (userId) {
      await activityService.log({
        userId,
        action: 'DELETE',
        entityType: 'GUEST',
        entityId: id,
        details: `Menghapus tamu: ${existing.guestName}`,
      });
    }
    return deleted;
  },

  updateStatusByInvitationAndName: async (
    invitationId: number,
    guestName: string,
    status: GuestStatusEnum,
  ) => {
    const updated =
      await invitationGuestRepository.updateStatusByInvitationAndName(
        invitationId,
        guestName,
        status,
      );

    if (!updated) {
      throw new Error('Tamu tidak ditemukan dalam daftar undangan.');
    }

    return updated;
  },
};
