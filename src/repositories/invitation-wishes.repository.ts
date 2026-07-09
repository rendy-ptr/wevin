import { db } from '@/db';
import { invitationGuests } from '@/db/table/invitation/invitation-guests.table';
import { invitationWishes } from '@/db/table/invitation/invitation-wishes.table';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { and, eq } from 'drizzle-orm';

export const invitationWishesRepository = {
  create: async (payload: {
    invitationId: number;
    guestName: string;
    message: string;
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

    const [existingWish] = await db
      .select()
      .from(invitationWishes)
      .where(eq(invitationWishes.invitationGuestId, guest.id));

    if (existingWish) {
      throw new Error('Anda sudah mengirimkan ucapan sebelumnya');
    }

    const [created] = await db
      .insert(invitationWishes)
      .values({
        invitationId: payload.invitationId,
        invitationGuestId: guest.id,
        guestName: payload.guestName,
        message: payload.message,
      })
      .returning();

    await db
      .update(invitationGuests)
      .set({ status: GuestStatusEnum.Responded })
      .where(eq(invitationGuests.id, guest.id));

    return created;
  },

  getByInvitationId: async (invitationId: number) => {
    return await db.query.invitationWishes.findMany({
      where: eq(invitationWishes.invitationId, invitationId),
      orderBy: (wishes, { desc }) => [desc(wishes.createdAt)],
    });
  },
};
