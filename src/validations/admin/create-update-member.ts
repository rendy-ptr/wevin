import { z } from 'zod';

export const createUpdateMemberSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  email: z.email('Email tidak valid'),
  packageId: z.number().int().positive('Paket harus dipilih'),
});

export type CreateUpdateMemberFormValues = z.infer<
  typeof createUpdateMemberSchema
>;
