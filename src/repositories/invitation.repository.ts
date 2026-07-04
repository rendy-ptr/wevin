import { db } from '@/db';
import { invitationEvents } from '@/db/table/invitation/invitation-events.table';
import { invitationGallery } from '@/db/table/invitation/invitation-galleries.table';
import { invitations } from '@/db/table/invitation/invitations.table';
import { memberProfiles } from '@/db/table/member-profiles.table';
import { packageQuotas } from '@/db/table/package-quotas.table';
import { InvitationStatusEnum } from '@/enums/invitation.enum';
import { InvitationFilterParams } from '@/types/invitation.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { and, count, desc, eq, ilike, or } from 'drizzle-orm';

export const invitationRepository = {
  getActiveDaysQuota: async (memberProfileId: number) => {
    const quota = await db
      .select({ activeDays: packageQuotas.value })
      .from(memberProfiles)
      .leftJoin(
        packageQuotas,
        and(
          eq(packageQuotas.packageId, memberProfiles.packageId),
          eq(packageQuotas.quotaKey, 'active_days'),
        ),
      )
      .where(eq(memberProfiles.id, memberProfileId))
      .limit(1);

    return quota;
  },

  getAll: async (
    memberProfileId: number,
    { search, status, page = 1, limit = 10 }: InvitationFilterParams,
  ) => {
    const offset = (page - 1) * limit;

    const conditions = [];

    conditions.push(eq(invitations.memberId, memberProfileId));

    if (search) {
      conditions.push(
        or(
          ilike(invitations.groomFullName, `%${search}%`),
          ilike(invitations.brideFullName, `%${search}%`),
          ilike(invitations.slug, `%${search}%`),
        ),
      );
    }

    if (status) {
      conditions.push(eq(invitations.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalCount] = await db
      .select({ count: count() })
      .from(invitations)
      .where(whereClause);

    const rawData = await db.query.invitations.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(invitations.createdAt)],
      with: {
        template: {
          columns: { name: true },
        },
        invitationEvents: {
          columns: { date: true, time: true },
          orderBy: (events, { asc }) => [asc(events.sortOrder)],
        },
      },
    });

    const data = rawData.map((item) => ({
      id: item.id,
      slug: item.slug,
      status: item.status,
      groomName: item.groomName,
      brideName: item.brideName,
      templateName: item.template?.name || '',
      createdAt: item.createdAt,
      publishedAt: item.publishedAt,
      events: item.invitationEvents,
    }));

    return {
      data,
      meta: {
        total: Number(totalCount.count),
        page,
        limit,
        totalPages: Math.ceil(Number(totalCount.count) / limit),
      },
    };
  },

  getById: async (id: number) => {
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, id),
      with: {
        invitationEvents: {
          orderBy: (events, { asc }) => [asc(events.sortOrder)],
        },
        invitationGallery: {
          orderBy: (gallery, { asc }) => [asc(gallery.sortOrder)],
        },
      },
    });
    return invitation;
  },

  checkMemberId: async (userId: number) => {
    return await db.query.memberProfiles.findFirst({
      where: eq(memberProfiles.userId, userId),
    });
  },

  createInvitation: async (
    memberProfileId: number,
    data: CreateUpdateInvitationFormValues & { slug: string },
  ) => {
    return await db.transaction(async (tx) => {
      const [newInvitation] = await tx
        .insert(invitations)
        .values({
          memberId: memberProfileId,
          templateId: Number(data.templateId),
          slug: data.slug || '',
          status: data.status,
          publishedAt:
            data.status === InvitationStatusEnum.Published ? new Date() : null,
          groomName: data.groomName,
          brideName: data.brideName,
          groomFullName: data.groomFullName,
          groomParents: data.groomParents,
          brideFullName: data.brideFullName,
          brideParents: data.brideParents,
          musicUrl: data.musicUrl || '',
          liveStreamUrl: data.liveStreamUrl || '',
          enabledFeatures:
            (data.enabledFeatures as Record<string, boolean>) || {},
          wording: {
            prefixTitle: data.prefixTitle,
            coverGreeting: data.coverGreeting,
            coverQuote: data.coverQuote,
            heroTitle: data.heroTitle,
            openingGreeting: data.openingGreeting,
            openingMessage: data.openingMessage,
            closingGreeting: data.closingGreeting,
            closingMessage: data.closingMessage,
          },
        })
        .returning({ id: invitations.id });

      const invitationId = newInvitation.id;

      if (data.events && data.events.length > 0) {
        await tx.insert(invitationEvents).values(
          data.events.map((event, index) => ({
            invitationId,
            title: event.title,
            date: new Date(event.date),
            time: event.time,
            timezone: event.timezone,
            location: event.location,
            address: event.address,
            mapsUrl: event.mapsUrl,
            sortOrder: index,
          })),
        );
      }

      if (data.gallery && data.gallery.length > 0) {
        await tx.insert(invitationGallery).values(
          data.gallery.map((galleryItem, index) => ({
            invitationId,
            imageUrl: galleryItem.imageUrl,
            sortOrder: index,
          })),
        );
      }

      return invitationId;
    });
  },

  updateInvitation: async (
    invitationId: number,
    data: CreateUpdateInvitationFormValues & { slug: string },
  ) => {
    return await db.transaction(async (tx) => {
      await tx
        .update(invitations)
        .set({
          templateId: Number(data.templateId),
          slug: data.slug,
          status: data.status,
          publishedAt:
            data.status === InvitationStatusEnum.Published ? new Date() : null,
          musicUrl: data.musicUrl || '',
          liveStreamUrl: data.liveStreamUrl || '',
          enabledFeatures:
            (data.enabledFeatures as Record<string, boolean>) || {},
          groomName: data.groomName,
          groomFullName: data.groomFullName,
          groomParents: data.groomParents,
          brideName: data.brideName,
          brideFullName: data.brideFullName,
          brideParents: data.brideParents,
          wording: {
            prefixTitle: data.prefixTitle,
            coverGreeting: data.coverGreeting,
            coverQuote: data.coverQuote,
            openingGreeting: data.openingGreeting,
            openingMessage: data.openingMessage,
            closingGreeting: data.closingGreeting,
            closingMessage: data.closingMessage,
          },
          updatedAt: new Date(),
        })
        .where(eq(invitations.id, invitationId));

      await tx
        .delete(invitationEvents)
        .where(eq(invitationEvents.invitationId, invitationId));

      if (data.events && data.events.length > 0) {
        await tx.insert(invitationEvents).values(
          data.events.map((event, index) => ({
            invitationId,
            title: event.title,
            date: new Date(event.date),
            time: event.time,
            timezone: event.timezone,
            location: event.location,
            address: event.address,
            mapsUrl: event.mapsUrl,
            sortOrder: index,
          })),
        );
      }

      await tx
        .delete(invitationGallery)
        .where(eq(invitationGallery.invitationId, invitationId));

      if (data.gallery && data.gallery.length > 0) {
        await tx.insert(invitationGallery).values(
          data.gallery.map((galleryItem, index) => ({
            invitationId,
            imageUrl: galleryItem.imageUrl,
            sortOrder: index,
          })),
        );
      }

      return invitationId;
    });
  },

  deleteInvitation: async (id: number) => {
    return await db.transaction(async (tx) => {
      await tx
        .delete(invitationEvents)
        .where(eq(invitationEvents.invitationId, id));
      await tx
        .delete(invitationGallery)
        .where(eq(invitationGallery.invitationId, id));
      await tx.delete(invitations).where(eq(invitations.id, id));
    });
  },
};
