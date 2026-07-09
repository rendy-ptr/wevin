import { BusinessError, DuplicateError, NotFoundError } from '@/lib/errors';
import { packageRepository } from '@/repositories/package.repository';
import { activityService } from '@/services/activity.service';
import type {
  ActivePackageWithBenefits,
  BasePackageModel,
  PackageFilterParams,
  PackageWithRelationships,
} from '@/types/package.type';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';

export const packageService = {
  getAll: async ({
    search,
    isActive,
    isPopular,
    page,
    limit,
  }: PackageFilterParams) => {
    return await packageRepository.getAll({
      search,
      isActive,
      isPopular,
      page,
      limit,
    });
  },

  findById: async (
    id: number,
  ): Promise<Pick<BasePackageModel, 'id'> | undefined> => {
    const getPackageById = await packageRepository.getById(id);

    if (!getPackageById) {
      throw new NotFoundError('Package not found');
    }

    return getPackageById;
  },

  create: async (
    payload: CreateUpdatePackageFormValues,
    userId?: number,
  ): Promise<BasePackageModel> => {
    const existingPackage = await packageRepository.getByName(payload.name);

    if (existingPackage) {
      throw new DuplicateError('Package already exists');
    }

    if (payload.isActive) {
      const existingActivePackage = await packageRepository.getActive();

      if (existingActivePackage.length >= 4) {
        throw new BusinessError('Only 4 active packages are allowed');
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
  ): Promise<BasePackageModel> => {
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

  delete: async (
    id: number,
    userId?: number,
  ): Promise<BasePackageModel | undefined> => {
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

  getActiveWithBenefits: async (): Promise<ActivePackageWithBenefits[]> => {
    const packages = await packageRepository.getPackageActiveWithBenefits();

    return packages;
  },

  getWithRelationships: async (
    id: number,
  ): Promise<PackageWithRelationships | undefined> => {
    const packageData = await packageRepository.getPackageWithRelationships(id);

    if (!packageData) {
      throw new NotFoundError('Package not found');
    }

    return packageData;
  },
};
