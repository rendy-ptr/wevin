import { BENEFITS_DATA } from '@/constants/benefit.constant';
import { BenefitKeyType } from '@/types/benefit.type';
import { z } from 'zod';

const benefitKeys = BENEFITS_DATA.map((b) => b.key) as [string, ...string[]];

export const createUpdatePackageSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  benefits: z.array(
    z.object({
      benefitKey: z.enum(benefitKeys as [BenefitKeyType, ...BenefitKeyType[]]),
      toggleValue: z.boolean().optional(),
      quotaValue: z.number().optional(),
    }),
  ),
  templateIds: z.array(z.number()),
});

export type CreateUpdatePackageFormValues = z.infer<
  typeof createUpdatePackageSchema
>;
