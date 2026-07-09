import { db } from '@/db';
import { invitationGuests } from '@/db/table/invitation/invitation-guests.table';
import { invitationRSVP } from '@/db/table/invitation/invitation-rsvp.table';
import { GuestStatusEnum, RSVPStatusEnum } from '@/enums/invitation.enum';
import { and, eq } from 'drizzle-orm';

export const invitationRSVPRepository = {
  create: async (payload: {
    invitationId: number;
    guestName: string;
    status: RSVPStatusEnum;
    guestCount?: number;
    reason?: string;
  }) => {
    const [guest] = await db
      .select()
      .from(invitationGuests)
      .where(
        and(
          eq(invitationGuests.invitationId, payload.invitationId),
          eq(invitationGuests.guestName, payload.guestName),
        ),
      );

    if (!guest) throw new Error('Guest not found');

    const [existingRSVP] = await db
      .select()
      .from(invitationRSVP)
      .where(eq(invitationRSVP.invitationGuestId, guest.id));

    if (existingRSVP) {
      throw new Error('Anda sudah mengisi form RSVP sebelumnya');
    }

    const [created] = await db
      .insert(invitationRSVP)
      .values({
        invitationId: payload.invitationId,
        invitationGuestId: guest.id,
        status: payload.status,
        guestCount: payload.guestCount,
        reason: payload.reason,
      })
      .returning();

    await db
      .update(invitationGuests)
      .set({ status: GuestStatusEnum.Responded })
      .where(eq(invitationGuests.id, guest.id));

    return created;
  },

  getByInvitationId: async (invitationId: number) => {
    return await db.query.invitationRSVP.findMany({
      where: eq(invitationRSVP.invitationId, invitationId),
      with: {
        guest: true,
      },
    });
  },
};
