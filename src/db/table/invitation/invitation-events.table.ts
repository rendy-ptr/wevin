import { TimezoneEnum } from '@/enums/invitation.enum';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { timezoneEnum } from './enums';
import { invitations } from './invitations.table';

export const invitationEvents = pgTable('invitation_events', {
  id: serial('id').primaryKey(),
  invitationId: integer('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),

  title: varchar('title', { length: 150 }).notNull(),
  date: timestamp('date').notNull(),
  time: varchar('time', { length: 100 }).notNull(),
  timezone: timezoneEnum('timezone').notNull().default(TimezoneEnum.WIB),
  location: varchar('location', { length: 255 }).notNull(),
  address: text('address').notNull(),
  mapsUrl: varchar('maps_url', { length: 500 }),

  sortOrder: integer('sort_order').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invitationEventsRelations = relations(
  invitationEvents,
  ({ one }) => ({
    invitation: one(invitations, {
      fields: [invitationEvents.invitationId],
      references: [invitations.id],
    }),
  }),
);
