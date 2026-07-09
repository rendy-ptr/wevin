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

export type GuestItem = {
  id: number;
  invitationId: number;
  guestName: string;
  phoneNumber: string | null;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  invitation?: {
    groomName: string;
    brideName: string;
    slug: string;
  };
  rsvp?: {
    status: string;
    guestCount: number;
    reason?: string | null;
  } | null;
  wishes?: {
    message: string;
  } | null;
};

export type InvitationGuest = InferSelectModel<typeof invitationGuests>;
