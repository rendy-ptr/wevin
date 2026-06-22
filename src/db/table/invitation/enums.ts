import {
  GuestBookStatusEnum,
  InvitationStatusEnum,
  RSVPStatusEnum,
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
  GuestBookStatusEnum.Draft,
  GuestBookStatusEnum.Sent,
  GuestBookStatusEnum.Opened,
  GuestBookStatusEnum.RSVPConfirmed,
]);
