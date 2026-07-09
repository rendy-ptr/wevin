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
import { invitationRSVP } from './invitation-rsvp.table';
import { invitationWishes } from './invitation-wishes.table';
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
    .default(GuestStatusEnum.Idle)
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
    rsvp: one(invitationRSVP, {
      fields: [invitationGuests.id],
      references: [invitationRSVP.invitationGuestId],
    }),
    wishes: one(invitationWishes, {
      fields: [invitationGuests.id],
      references: [invitationWishes.invitationGuestId],
    }),
  }),
);
