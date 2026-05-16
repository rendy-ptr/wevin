import { NotFoundError } from '@/lib/errors';
import { benefitRepository } from '@/repositories/benefit.repository';
import type { BenefitFilterParams } from '@/types/benefit.type';

export const benefitService = {
  getAll: async ({
    search,
    type,
    page = 1,
    limit = 10,
  }: BenefitFilterParams) => {
    return await benefitRepository.getAll({ search, type, page, limit });
  },

  getById: async (id: number) => {
    const benefit = await benefitRepository.getById(id);

    if (!benefit) {
      throw new NotFoundError('Benefit not found');
    }

    return benefit;
  },
};
