import { db } from '@/db';
import { invitationGuests } from '@/db/table/invitation/invitation-guests.table';
import { GuestFilterParams } from '@/types/guest.type';
import { CreateUpdateInvitationGuestFormValues } from '@/validations/member/create-update-guest';
import { and, count, desc, eq, ilike } from 'drizzle-orm';

export const invitationGuestRepository = {
  getAll: async ({
    search,
    invitationId,
    status,
    page = 1,
    limit = 10,
  }: GuestFilterParams) => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      invitationId
        ? eq(invitationGuests.invitationId, invitationId)
        : undefined,
      status ? eq(invitationGuests.status, status) : undefined,
      search ? ilike(invitationGuests.guestName, `%${search}%`) : undefined,
    );

    const items = await db.query.invitationGuests.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(invitationGuests.createdAt)],
      with: {
        invitation: true,
      },
    });

    const [totalResult] = await db
      .select({ value: count() })
      .from(invitationGuests)
      .where(whereClause);

    return {
      items,
      total: totalResult.value,
    };
  },

  getById: async (id: number) => {
    return await db.query.invitationGuests.findFirst({
      where: eq(invitationGuests.id, id),
      with: {
        invitation: true,
      },
    });
  },

  create: async (payload: CreateUpdateInvitationGuestFormValues) => {
    const [newGuest] = await db
      .insert(invitationGuests)
      .values({
        invitationId: payload.invitationId,
        guestName: payload.guestName,
        phoneNumber: payload.phoneNumber || null,
        status: payload.status,
      })
      .returning();

    return newGuest;
  },

  createMany: async (payloads: CreateUpdateInvitationGuestFormValues[]) => {
    return db.transaction(async (tx) => {
      const newGuests = await tx
        .insert(invitationGuests)
        .values(
          payloads.map((payload) => ({
            invitationId: payload.invitationId,
            guestName: payload.guestName,
            phoneNumber: payload.phoneNumber || null,
            status: payload.status,
          })),
        )
        .returning();
      return newGuests;
    });
  },

  update: async (
    id: number,
    payload: CreateUpdateInvitationGuestFormValues,
  ) => {
    const [updatedGuest] = await db
      .update(invitationGuests)
      .set({
        guestName: payload.guestName,
        phoneNumber: payload.phoneNumber || null,
        status: payload.status,
      })
      .where(eq(invitationGuests.id, id))
      .returning();

    return updatedGuest;
  },

  delete: async (id: number) => {
    const [deletedGuest] = await db
      .delete(invitationGuests)
      .where(eq(invitationGuests.id, id))
      .returning();
    return deletedGuest;
  },
};
