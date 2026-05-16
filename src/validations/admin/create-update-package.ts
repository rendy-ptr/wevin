import { packageStatusEnum } from '@/db/schema';
import { z } from 'zod';

export const createUpdatePackageSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  price: z.number().min(1, 'Harga minimal 1'),
  status: z.enum(packageStatusEnum.enumValues),
  benefits: z.array(
    z.object({
      benefitId: z.number(),
      value: z.any(),
    }),
  ),
});

export type CreateUpdatePackageFormValues = z.infer<
  typeof createUpdatePackageSchema
>;
