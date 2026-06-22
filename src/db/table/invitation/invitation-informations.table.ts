import { InvitationStatusEnum } from '@/enums/invitation.enum';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { templates } from '../template.table';
import { invitationStatusEnum } from './enums';
import { invitations } from './invitations.table';

export const invitationInformation = pgTable('invitation_information', {
  id: serial('id').primaryKey(),
  invitationId: integer('invitation_id')
    .references(() => invitations.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  slug: varchar('slug', { length: 255 }).notNull().unique(),
  status: invitationStatusEnum('status')
    .default(InvitationStatusEnum.Draft)
    .notNull(),

  groomName: varchar('groom_name', { length: 100 }),
  groomParents: varchar('groom_parents', { length: 255 }),

  brideName: varchar('bride_name', { length: 100 }),
  brideParents: varchar('bride_parents', { length: 255 }),

  akadDate: timestamp('akad_date'),
  akadTime: varchar('akad_time', { length: 100 }),
  akadLocation: varchar('akad_location', { length: 100 }),
  akadAddress: text('akad_address'),
  akadMapsUrl: varchar('akad_maps_url', { length: 500 }),

  resepsiDate: timestamp('resepsi_date'),
  resepsiTime: varchar('resepsi_time', { length: 100 }),
  resepsiLocation: varchar('resepsi_location', { length: 100 }),
  resepsiAddress: text('resepsi_address'),
  resepsiMapsUrl: varchar('resepsi_maps_url', { length: 500 }),

  templateId: integer('template_id').references(() => templates.id, {
    onDelete: 'set null',
  }),
  musicUrl: varchar('music_url', { length: 500 }),
  customMessage: text('custom_message'),
  liveStreamUrl: varchar('live_stream_url', { length: 500 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invitationInformationRelations = relations(
  invitationInformation,
  ({ one }) => ({
    invitation: one(invitations, {
      fields: [invitationInformation.invitationId],
      references: [invitations.id],
    }),
    template: one(templates, {
      fields: [invitationInformation.templateId],
      references: [templates.id],
    }),
  }),
);
