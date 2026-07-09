import { GuestStatusEnum } from '@/enums/invitation.enum';
import { z } from 'zod';

export const createUpdateInvitationGuestSchema = z.object({
  id: z.number().optional(),
  invitationId: z.number(),
  guestName: z
    .string()
    .min(2, 'Nama tamu minimal 2 karakter')
    .max(255)
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')),
  phoneNumber: z
    .string()
    .max(50)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  status: z.enum(GuestStatusEnum).optional(),
});

export type CreateUpdateInvitationGuestFormValues = z.infer<
  typeof createUpdateInvitationGuestSchema
>;

export const updateStatusSchema = z.object({
  invitationId: z.number().or(z.string().transform(Number)),
  guestName: z
    .string()
    .min(2, 'Nama tamu minimal 2 karakter')
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')),
  status: z.enum([GuestStatusEnum.Opened, GuestStatusEnum.Responded]),
});
