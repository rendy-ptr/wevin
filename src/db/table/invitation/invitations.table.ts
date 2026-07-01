import { InvitationStatusEnum } from '@/enums/invitation.enum';
import { relations } from 'drizzle-orm';
import {
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { memberProfiles } from '../member-profiles.table';
import { templates } from '../template.table';
import { invitationStatusEnum } from './enums';
import { invitationEvents } from './invitation-events.table';
import { invitationGallery } from './invitation-galleries.table';
import { invitationGuests } from './invitation-guests.table';
import { invitationRSVP } from './invitation-rsvp.table';

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id')
    .references(() => memberProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  templateId: integer('template_id').references(() => templates.id, {
    onDelete: 'set null',
  }),

  slug: varchar('slug', { length: 255 }).notNull().unique(),
  status: invitationStatusEnum('status')
    .default(InvitationStatusEnum.Draft)
    .notNull(),

  groomName: varchar('groom_name', { length: 100 }),
  brideName: varchar('bride_name', { length: 100 }),
  groomFullName: varchar('groom_full_name', { length: 255 }),
  brideFullName: varchar('bride_full_name', { length: 255 }),
  groomParents: varchar('groom_parents', { length: 255 }),
  brideParents: varchar('bride_parents', { length: 255 }),

  musicUrl: varchar('music_url', { length: 500 }),
  liveStreamUrl: varchar('live_stream_url', { length: 500 }),

  enabledFeatures: jsonb('enabled_features')
    .$type<Record<string, boolean>>()
    .default({}),

  wording: jsonb('wording')
    .$type<{
      prefixTitle?: string;
      coverGreeting?: string;
      coverQuote?: string;
      heroTitle?: string;
      openingGreeting?: string;
      openingMessage?: string;
      closingGreeting?: string;
      closingMessage?: string;
    }>()
    .default({}),

  publishedAt: timestamp('published_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invitationRelations = relations(invitations, ({ one, many }) => ({
  memberProfile: one(memberProfiles, {
    fields: [invitations.memberId],
    references: [memberProfiles.id],
  }),
  template: one(templates, {
    fields: [invitations.templateId],
    references: [templates.id],
  }),
  invitationEvents: many(invitationEvents),
  invitationRSVP: many(invitationRSVP),
  invitationGallery: many(invitationGallery),
  invitationGuests: many(invitationGuests),
}));
