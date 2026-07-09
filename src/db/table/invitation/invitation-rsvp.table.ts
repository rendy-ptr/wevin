import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { rsvpStatusEnum } from './enums';
import { invitationGuests } from './invitation-guests.table';
import { invitations } from './invitations.table';

export const invitationRSVP = pgTable('invitation_rsvps', {
  id: serial('id').primaryKey(),
  invitationId: integer('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),
  invitationGuestId: integer('invitation_guest_id')
    .references(() => invitationGuests.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),

  status: rsvpStatusEnum('status').notNull(),
  guestCount: integer('guest_count').default(0),
  reason: text('reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invitationRSVPRelations = relations(invitationRSVP, ({ one }) => ({
  invitation: one(invitations, {
    fields: [invitationRSVP.invitationId],
    references: [invitations.id],
  }),
  guest: one(invitationGuests, {
    fields: [invitationRSVP.invitationGuestId],
    references: [invitationGuests.id],
  }),
}));
