import { db } from '@/db';
import { invitations } from '@/db/schema';
import { invitationGuests } from '@/db/table/invitation/invitation-guests.table';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { GuestFilterParams } from '@/types/guestbook.type';
import { CreateUpdateInvitationGuestFormValues } from '@/validations/member/create-update-guest';
import { and, asc, count, desc, eq, ilike, inArray } from 'drizzle-orm';

export const invitationGuestRepository = {
  getAll: async (
    memberId: number,
    { search, invitationId, status, page = 1, limit = 10 }: GuestFilterParams,
  ) => {
    const offset = (page - 1) * limit;

    const allowedInvitations = db
      .select({ id: invitations.id })
      .from(invitations)
      .where(eq(invitations.memberId, memberId));

    const whereClause = and(
      inArray(invitationGuests.invitationId, allowedInvitations),
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
        rsvp: true,
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

  updateStatusByInvitationAndName: async (
    invitationId: number,
    guestName: string,
    status: GuestStatusEnum,
  ) => {
    const [updated] = await db
      .update(invitationGuests)
      .set({ status })
      .where(
        and(
          eq(invitationGuests.invitationId, invitationId),
          eq(invitationGuests.guestName, guestName),
        ),
      )
      .returning();
    return updated;
  },

  export: async (memberId: number) => {
    const allowedInvitations = db
      .select({ id: invitations.id })
      .from(invitations)
      .where(eq(invitations.memberId, memberId));

    return await db.query.invitationGuests.findMany({
      where: inArray(invitationGuests.invitationId, allowedInvitations),
      with: {
        wishes: true,
        rsvp: true,
        invitation: true,
      },
      orderBy: [asc(invitationGuests.guestName)],
    });
  },

  findById: async (id: number) => {
    return await db.query.invitationGuests.findFirst({
      where: eq(invitationGuests.id, id),
    });
  },

  findExactMatch: async (invitationId: number, guestName: string) => {
    return await db.query.invitationGuests.findFirst({
      where: and(
        eq(invitationGuests.invitationId, invitationId),
        ilike(invitationGuests.guestName, guestName),
      ),
    });
  },
};
