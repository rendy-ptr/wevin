import { invitationGuests } from '@/db/table/invitation/invitation-guests.table';
import { GuestBookStatusEnum } from '@/enums/invitation.enum';
import { InferSelectModel } from 'drizzle-orm';

export type BaseGuestBookModel = InferSelectModel<typeof invitationGuests>;

export type GuestBookStatusType = GuestBookStatusEnum;

export type GuestBookFilterParams = {
  search?: string;
  invitationId?: number;
  status?: GuestBookStatusType;
  page?: number;
  limit?: number;
};
