import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { invitationGuests } from './invitation-guests.table';
import { invitations } from './invitations.table';

export const invitationBooks = pgTable('invitation_books', {
  id: serial('id').primaryKey(),
  invitationId: integer('invitation_id')
    .references(() => invitations.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  prefixTitle: varchar('prefix_title', { length: 100 }).notNull(),
  coverGreeting: varchar('cover_greeting', { length: 100 }).notNull(),
  coverQuote: varchar('cover_quote', { length: 100 }).notNull(),
  groomName: varchar('groom_name', { length: 100 }).notNull(),
  brideName: varchar('bride_name', { length: 100 }).notNull(),
  eventDate: timestamp('event_date').notNull(),
  placement: varchar('placement', { length: 255 }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invitationBookRelations = relations(
  invitationBooks,
  ({ one, many }) => ({
    invitation: one(invitations, {
      fields: [invitationBooks.invitationId],
      references: [invitations.id],
    }),
    guests: many(invitationGuests),
  }),
);
