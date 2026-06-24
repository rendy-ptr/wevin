import { invitationGuestRepository } from '@/repositories/invitation-guest.repository';
import { activityService } from '@/services/activity.service';
import { GuestFilterParams } from '@/types/guest.type';
import { CreateUpdateInvitationGuestFormValues } from '@/validations/member/create-update-guest';

export const invitationGuestService = {
  getAll: async (params: GuestFilterParams) => {
    return await invitationGuestRepository.getAll(params);
  },

  getById: async (id: number) => {
    const guest = await invitationGuestRepository.getById(id);
    if (!guest) {
      throw new Error('Guest not found');
    }
    return guest;
  },

  create: async (
    payload: CreateUpdateInvitationGuestFormValues,
    userId?: number,
  ) => {
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
    const guests = await invitationGuestRepository.createMany(payloads);
    if (userId) {
      await activityService.log({
        userId,
        action: 'CREATE',
        entityType: 'GUEST',
        entityId: guests[0]?.id || 0,
        details: `Menambahkan ${guests.length} tamu secara massal`,
      });
    }
    return guests;
  },

  update: async (
    id: number,
    payload: CreateUpdateInvitationGuestFormValues,
    userId?: number,
  ) => {
    await invitationGuestService.getById(id);
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
    const existing = await invitationGuestService.getById(id);
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
};
