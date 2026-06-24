import { invitationGuests } from '@/db/schema';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { InferSelectModel } from 'drizzle-orm';

export type GuestFilterParams = {
  search?: string;
  invitationId?: number;
  status?: GuestStatusEnum;
  page?: number;
  limit?: number;
};

export type InvitationGuest = InferSelectModel<typeof invitationGuests>;
