import { PACKAGE_STATUS_VALUES } from '@/constants/package.constant';
import { BusinessError, DuplicateError, NotFoundError } from '@/lib/errors';
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

    if (payload.status === PACKAGE_STATUS_VALUES.ACTIVE) {
      const existingActivePackage = await packageRepository.getActive();

      if (existingActivePackage.length >= 3) {
        throw new BusinessError('Only 3 active packages are allowed');
      }
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
