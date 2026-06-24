import {
  GuestStatusEnum,
  InvitationStatusEnum,
  RSVPStatusEnum,
  TimezoneEnum,
} from '@/enums/invitation.enum';
import { pgEnum } from 'drizzle-orm/pg-core';

export const invitationStatusEnum = pgEnum('invitation_status', [
  InvitationStatusEnum.Draft,
  InvitationStatusEnum.Published,
  InvitationStatusEnum.Expired,
]);

export const rsvpStatusEnum = pgEnum('rsvp_status', [
  RSVPStatusEnum.Present,
  RSVPStatusEnum.NotPresent,
]);

export const invitationGuestStatusEnum = pgEnum('invitation_guest_status', [
  GuestStatusEnum.Draft,
  GuestStatusEnum.Sent,
  GuestStatusEnum.Opened,
]);

export const timezoneEnum = pgEnum('timezone', [
  TimezoneEnum.WIB,
  TimezoneEnum.WITA,
  TimezoneEnum.WIT,
]);
