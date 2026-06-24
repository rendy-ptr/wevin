import { GuestStatusEnum } from '@/enums/invitation.enum';
import { z } from 'zod';

export const createUpdateInvitationGuestSchema = z.object({
  id: z.number().optional(),
  invitationId: z.number(),
  guestName: z.string(),
  phoneNumber: z.string().optional(),
  status: z.enum(GuestStatusEnum),
});

export type CreateUpdateInvitationGuestFormValues = z.infer<
  typeof createUpdateInvitationGuestSchema
>;
