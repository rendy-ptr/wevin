import { db } from '@/db';
import { invitationEvents } from '@/db/table/invitation/invitation-events.table';
import { invitationGallery } from '@/db/table/invitation/invitation-galleries.table';
import { invitations } from '@/db/table/invitation/invitations.table';
import { memberProfiles } from '@/db/table/member-profiles.table';
import { templates } from '@/db/table/template.table';
import { InvitationFilterParams } from '@/types/invitation.type';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { and, count, desc, eq, ilike, or } from 'drizzle-orm';

export const invitationRepository = {
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

    const data = await db
      .select({
        id: invitations.id,
        slug: invitations.slug,
        status: invitations.status,
        groomName: invitations.groomName,
        brideName: invitations.brideName,
        templateName: templates.name,
        createdAt: invitations.createdAt,
      })
      .from(invitations)
      .leftJoin(templates, eq(invitations.templateId, templates.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(invitations.createdAt));

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
};
