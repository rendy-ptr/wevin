import { GuestStatusEnum } from '@/enums/invitation.enum';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { invitationGuestStatusEnum } from './enums';
import { invitations } from './invitations.table';

export const invitationGuests = pgTable('invitation_guests', {
  id: serial('id').primaryKey(),
  invitationId: integer('invitation_id')
    .references(() => invitations.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  guestName: varchar('guest_name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 50 }),
  status: invitationGuestStatusEnum('status')
    .default(GuestStatusEnum.Draft)
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invitationGuestRelations = relations(
  invitationGuests,
  ({ one }) => ({
    invitation: one(invitations, {
      fields: [invitationGuests.invitationId],
      references: [invitations.id],
    }),
  }),
);
