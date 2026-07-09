import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { invitationGuests } from './invitation-guests.table';
import { invitations } from './invitations.table';

export const invitationWishes = pgTable('invitation_wishes', {
  id: serial('id').primaryKey(),
  invitationId: integer('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),
  invitationGuestId: integer('invitation_guest_id').references(
    () => invitationGuests.id,
    { onDelete: 'cascade' },
  ),

  guestName: text('guest_name').notNull(),
  message: text('message').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invitationWishesRelations = relations(
  invitationWishes,
  ({ one }) => ({
    invitation: one(invitations, {
      fields: [invitationWishes.invitationId],
      references: [invitations.id],
    }),
    guest: one(invitationGuests, {
      fields: [invitationWishes.invitationGuestId],
      references: [invitationGuests.id],
    }),
  }),
);
