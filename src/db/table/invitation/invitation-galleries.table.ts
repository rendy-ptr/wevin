import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { invitations } from './invitations.table';

export const invitationGallery = pgTable('invitation_galleries', {
  id: serial('id').primaryKey(),
  invitationId: integer('invitation_id')
    .references(() => invitations.id, { onDelete: 'cascade' })
    .notNull(),

  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invitationGalleriesRelations = relations(
  invitationGallery,
  ({ one }) => ({
    invitation: one(invitations, {
      fields: [invitationGallery.invitationId],
      references: [invitations.id],
    }),
  }),
);
