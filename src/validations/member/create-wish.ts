import { z } from 'zod';

export const createWishSchema = z.object({
  invitationId: z.number(),
  guestName: z
    .string()
    .min(2, 'Nama tamu minimal 2 karakter')
    .max(255)
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')),
  message: z.string().min(1, 'Message cannot be empty'),
});

export type CreateWishFormValues = z.infer<typeof createWishSchema>;
