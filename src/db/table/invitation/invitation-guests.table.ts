import { GuestBookStatusEnum } from '@/enums/invitation.enum';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { invitationGuestStatusEnum } from './enums';
import { invitationBooks } from './invitation-books.table';
import { invitationRSVP } from './invitation-rsvp.table';

export const invitationGuests = pgTable('invitation_guests', {
  id: serial('id').primaryKey(),
  invitationBookId: integer('invitation_book_id')
    .references(() => invitationBooks.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  guestName: varchar('guest_name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 50 }),
  status: invitationGuestStatusEnum('status')
    .default(GuestBookStatusEnum.Draft)
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
    invitationBook: one(invitationBooks, {
      fields: [invitationGuests.invitationBookId],
      references: [invitationBooks.id],
    }),
    rsvp: one(invitationRSVP, {
      fields: [invitationGuests.id],
      references: [invitationRSVP.invitationGuestId],
    }),
  }),
);
