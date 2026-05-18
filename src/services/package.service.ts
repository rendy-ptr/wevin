import { PACKAGE_STATUS_VALUES } from '@/constants/package.constant';
import { BusinessError, DuplicateError, NotFoundError } from '@/lib/errors';
import { packageRepository } from '@/repositories/package.repository';
import { activityService } from '@/services/activity.service';
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

  create: async (payload: CreateUpdatePackageFormValues, userId?: number) => {
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

    const newPackage = await packageRepository.create(payload);

    if (userId) {
      await activityService.log({
        userId,
        action: 'CREATE',
        entityType: 'PACKAGE',
        entityId: newPackage.id,
        details: `Membuat paket baru: ${newPackage.name}`,
      });
    }

    return newPackage;
  },

  update: async (
    id: number,
    payload: CreateUpdatePackageFormValues,
    userId?: number,
  ) => {
    const packageData = await packageRepository.getById(id);

    if (!packageData) {
      throw new NotFoundError('Package not found');
    }

    const updatedPackage = await packageRepository.update(id, payload);

    if (userId) {
      await activityService.log({
        userId,
        action: 'UPDATE',
        entityType: 'PACKAGE',
        entityId: id,
        details: `Memperbarui data paket: ${updatedPackage.name}`,
      });
    }

    return updatedPackage;
  },

  delete: async (id: number, userId?: number) => {
    const packageData = await packageRepository.getById(id);

    if (!packageData) {
      throw new NotFoundError('Package not found');
    }

    const result = await packageRepository.delete(id);

    if (userId) {
      await activityService.log({
        userId,
        action: 'DELETE',
        entityType: 'PACKAGE',
        entityId: id,
        details: `Menghapus paket: ${packageData.name}`,
      });
    }

    return result;
  },
};
