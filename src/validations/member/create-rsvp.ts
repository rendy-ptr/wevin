import { RSVPStatusEnum } from '@/enums/invitation.enum';
import { z } from 'zod';

export const createRSVPSchema = z.object({
  invitationId: z.number(),
  guestName: z
    .string()
    .min(2, 'Nama tamu minimal 2 karakter')
    .max(255)
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')),
  status: z.enum(RSVPStatusEnum),
  guestCount: z.number().min(1, 'Guest count cannot be negative').optional(),
  reason: z.string().optional(),
});

export type CreateRSVPFormValues = z.infer<typeof createRSVPSchema>;
