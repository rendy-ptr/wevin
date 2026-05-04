import {
  BENEFIT_TYPES,
  BenefitType,
  SYSTEM_ACTIONS,
  SystemAction,
} from '@/constants/benefits';
import { z } from 'zod';

export const createUpdateBenefitSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  key: z.enum(
    Object.values(SYSTEM_ACTIONS) as [SystemAction, ...SystemAction[]],
  ),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  type: z.enum(Object.values(BENEFIT_TYPES) as [BenefitType, ...BenefitType[]]),
});

export type CreateUpdateBenefitFormValues = z.infer<
  typeof createUpdateBenefitSchema
>;
