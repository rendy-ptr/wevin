import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { memberProfiles } from '../member-profiles.table';
import { templates } from '../template.table';
import { invitationBooks } from './invitation-books.table';
import { invitationGallery } from './invitation-galleries.table';
import { invitationInformation } from './invitation-informations.table';
import { invitationRSVP } from './invitation-rsvp.table';

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id')
    .references(() => memberProfiles.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  templateId: integer('template_id').references(() => templates.id, {
    onDelete: 'set null',
  }),

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
  invitationBooks: one(invitationBooks, {
    fields: [invitations.id],
    references: [invitationBooks.invitationId],
  }),
  invitationInformation: one(invitationInformation, {
    fields: [invitations.id],
    references: [invitationInformation.invitationId],
  }),
  invitationRSVP: many(invitationRSVP),
  invitationGallery: many(invitationGallery),
}));
