import { DuplicateError, NotFoundError } from '@/lib/errors';
import { packageRepository } from '@/repositories/package.repository';
import type { PackageFilterParams } from '@/types/package.type';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';

export const packageService = {
  getAll: async ({ search, status, page, limit }: PackageFilterParams) => {
    return await packageRepository.getAll({
      search,
      status,
      page,
      limit,
    });
  },

  findById: async (id: number) => {
    const packageData = await packageRepository.getById(id);

    if (!packageData) {
      throw new NotFoundError('Package not found');
    }

    return packageData;
  },

  create: async (payload: CreateUpdatePackageFormValues) => {
    const existingPackage = await packageRepository.getByName(payload.name);

    if (existingPackage) {
      throw new DuplicateError('Package already exists');
    }

    return packageRepository.create(payload);
  },

  update: async (id: number, payload: CreateUpdatePackageFormValues) => {
    const packageData = await packageRepository.getById(id);

    if (!packageData) {
      throw new NotFoundError('Package not found');
    }

    return packageRepository.update(id, payload);
  },

  delete: async (id: number) => {
    const packageData = await packageRepository.getById(id);

    if (!packageData) {
      throw new NotFoundError('Package not found');
    }

    return packageRepository.delete(id);
  },
};
