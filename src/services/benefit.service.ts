import { DuplicateError, NotFoundError } from '@/lib/errors';
import { benefitRepository } from '@/repositories/benefit.repository';
import type { BenefitFilterParams } from '@/types/benefit.type';
import type { CreateUpdateBenefitFormValues } from '@/validations/admin/create-update-benefit';

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

  create: async (data: CreateUpdateBenefitFormValues) => {
    const existingBenefit = await benefitRepository.getByValue({
      key: data.key,
      type: data.type,
    });

    if (existingBenefit) {
      throw new DuplicateError('Duplicate benefit key');
    }

    return await benefitRepository.create(data);
  },

  update: async (id: number, data: Partial<CreateUpdateBenefitFormValues>) => {
    const benefit = await benefitRepository.getById(id);
    if (!benefit) {
      throw new NotFoundError('Benefit not found');
    }
    return await benefitRepository.update(id, data);
  },

  delete: async (id: number) => {
    const benefit = await benefitRepository.getById(id);
    if (!benefit) {
      throw new NotFoundError('Benefit not found');
    }
    return await benefitRepository.delete(id);
  },
};
