import { BENEFITS_DATA } from '@/constants/benefit.constant';
import { db } from '@/db';
import {
  packageBenefits,
  packageQuotas,
  packages,
  packageTemplates,
} from '@/db/schema';
import type {
  BenefitKeyType,
  QuotaBenefitKeyType,
  ToggleBenefitKeyType,
} from '@/types/benefit.type';
import type {
  ActivePackageWithBenefits,
  BasePackageModel,
  PackageFilterParams,
  PackageIndexItem,
  PackageWithRelationships,
} from '@/types/package.type';
import type { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import { and, count, eq, ilike } from 'drizzle-orm';

export const packageRepository = {
  getAll: async ({
    search,
    isActive,
    isPopular,
    page = 1,
    limit = 10,
  }: PackageFilterParams): Promise<{
    data: PackageIndexItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      search ? ilike(packages.name, `%${search}%`) : undefined,
      isActive !== undefined ? eq(packages.isActive, isActive) : undefined,
      isPopular !== undefined ? eq(packages.isPopular, isPopular) : undefined,
    );

    const [items, [totalResult]] = await Promise.all([
      db.query.packages.findMany({
        where: whereClause,
        columns: {
          updatedAt: false,
        },
        with: {
          benefits: {
            columns: {
              id: true,
              benefitKey: true,
              value: true,
            },
          },
          quotas: {
            columns: {
              id: true,
              quotaKey: true,
              value: true,
            },
          },
          templates: {
            with: { template: { columns: { id: true, name: true } } },
          },
        },
        limit,
        offset,
        orderBy: (packages, { desc }) => [desc(packages.createdAt)],
      }),
      db.select({ value: count() }).from(packages).where(whereClause),
    ]);

    const mappedItems: PackageIndexItem[] = items.map((pkg) => {
      const mergedBenefits = [
        ...pkg.benefits.map((b) => ({
          id: b.id,
          benefitKey: b.benefitKey as BenefitKeyType,
          toggleValue: b.value,
          quotaValue: null,
        })),
        ...pkg.quotas.map((q) => ({
          id: q.id,
          benefitKey: q.quotaKey as BenefitKeyType,
          toggleValue: null,
          quotaValue: q.value,
        })),
      ];

      return {
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        isActive: pkg.isActive,
        isPopular: pkg.isPopular,
        createdAt: pkg.createdAt,
        templates: pkg.templates,
        benefits: mergedBenefits,
      };
    });

    return {
      data: mappedItems,
      meta: {
        total: totalResult.value,
        page,
        limit,
        totalPages: Math.ceil(totalResult.value / limit),
      },
    };
  },

  getById: async (
    id: number,
  ): Promise<Pick<BasePackageModel, 'id' | 'name'> | undefined> => {
    return db.query.packages.findFirst({
      where: eq(packages.id, id),
      columns: { id: true, name: true },
    });
  },

  getByName: async (
    name: string,
  ): Promise<Pick<BasePackageModel, 'id' | 'name'> | undefined> => {
    return db.query.packages.findFirst({
      where: eq(packages.name, name),
      columns: { id: true, name: true },
    });
  },

  getActive: async (): Promise<Pick<BasePackageModel, 'id' | 'isActive'>[]> => {
    return db.query.packages.findMany({
      where: eq(packages.isActive, true),
      columns: { id: true, isActive: true },
    });
  },

  create: async (
    payload: CreateUpdatePackageFormValues,
  ): Promise<BasePackageModel> => {
    const { benefits, templateIds, ...packageData } = payload;

    return db.transaction(async (tx) => {
      const [newPackage] = await tx
        .insert(packages)
        .values(packageData)
        .returning();

      if (benefits?.length) {
        const toggleBenefits = [];
        const quotaBenefits = [];

        for (const b of benefits) {
          const benefitDef = BENEFITS_DATA.find(
            (def) => def.key === b.benefitKey,
          );
          if (!benefitDef) {
            throw new Error(
              `Benefit key "${b.benefitKey}" tidak ada di konstanta`,
            );
          }

          if (benefitDef.type === 'toggle') {
            toggleBenefits.push({
              packageId: newPackage.id,
              benefitKey: b.benefitKey as ToggleBenefitKeyType,
              value: b.toggleValue ?? false,
            });
          } else if (benefitDef.type === 'quota') {
            quotaBenefits.push({
              packageId: newPackage.id,
              quotaKey: b.benefitKey as QuotaBenefitKeyType,
              value: b.quotaValue ?? 0,
            });
          }
        }

        if (toggleBenefits.length) {
          await tx.insert(packageBenefits).values(toggleBenefits);
        }
        if (quotaBenefits.length) {
          await tx.insert(packageQuotas).values(quotaBenefits);
        }
      }

      if (templateIds?.length) {
        await tx.insert(packageTemplates).values(
          templateIds.map((templateId) => ({
            packageId: newPackage.id,
            templateId,
          })),
        );
      }

      return newPackage as BasePackageModel;
    });
  },

  update: async (
    id: number,
    payload: CreateUpdatePackageFormValues,
  ): Promise<BasePackageModel> => {
    const { benefits, templateIds, ...packageData } = payload;

    return db.transaction(async (tx) => {
      const [updatedPackage] = await tx
        .update(packages)
        .set(packageData)
        .where(eq(packages.id, id))
        .returning();

      await tx.delete(packageBenefits).where(eq(packageBenefits.packageId, id));
      await tx.delete(packageQuotas).where(eq(packageQuotas.packageId, id));
      await tx
        .delete(packageTemplates)
        .where(eq(packageTemplates.packageId, id));

      if (benefits?.length) {
        const toggleBenefits = [];
        const quotaBenefits = [];

        for (const b of benefits) {
          const benefitDef = BENEFITS_DATA.find(
            (def) => def.key === b.benefitKey,
          );
          if (!benefitDef) {
            throw new Error(
              `Benefit key "${b.benefitKey}" tidak ada di konstanta`,
            );
          }

          if (benefitDef.type === 'toggle') {
            toggleBenefits.push({
              packageId: id,
              benefitKey: b.benefitKey as ToggleBenefitKeyType,
              value: b.toggleValue ?? false,
            });
          } else if (benefitDef.type === 'quota') {
            quotaBenefits.push({
              packageId: id,
              quotaKey: b.benefitKey as QuotaBenefitKeyType,
              value: b.quotaValue ?? 0,
            });
          }
        }

        if (toggleBenefits.length) {
          await tx.insert(packageBenefits).values(toggleBenefits);
        }
        if (quotaBenefits.length) {
          await tx.insert(packageQuotas).values(quotaBenefits);
        }
      }

      if (templateIds?.length) {
        await tx
          .insert(packageTemplates)
          .values(
            templateIds.map((templateId) => ({ packageId: id, templateId })),
          );
      }

      return updatedPackage as BasePackageModel;
    });
  },

  delete: async (id: number): Promise<BasePackageModel | undefined> => {
    const [result] = await db
      .delete(packages)
      .where(eq(packages.id, id))
      .returning();
    return result as BasePackageModel;
  },

  getPackageWithRelationships: async (
    id: number,
  ): Promise<PackageWithRelationships | undefined> => {
    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, id),
      columns: {
        createdAt: false,
        updatedAt: false,
      },
      with: {
        benefits: {
          columns: {
            id: true,
            benefitKey: true,
            value: true,
          },
        },
        quotas: {
          columns: {
            id: true,
            quotaKey: true,
            value: true,
          },
        },
        templates: {
          with: {
            template: {
              columns: { id: true, name: true },
            },
          },
        },
        members: {
          with: {
            user: {
              columns: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!pkg) return undefined;

    const mergedBenefits = [
      ...pkg.benefits.map((b) => ({
        id: b.id,
        benefitKey: b.benefitKey as BenefitKeyType,
        toggleValue: b.value,
        quotaValue: null,
      })),
      ...pkg.quotas.map((q) => ({
        id: q.id,
        benefitKey: q.quotaKey as BenefitKeyType,
        toggleValue: null,
        quotaValue: q.value,
      })),
    ];

    return {
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      isActive: pkg.isActive,
      isPopular: pkg.isPopular,
      templates: pkg.templates,
      members: pkg.members,
      benefits: mergedBenefits,
    };
  },

  getPackageActiveWithBenefits: async (): Promise<
    ActivePackageWithBenefits[]
  > => {
    const list = await db.query.packages.findMany({
      where: eq(packages.isActive, true),
      columns: { id: true, name: true, price: true },
      with: {
        benefits: {
          columns: {
            id: true,
            benefitKey: true,
            value: true,
          },
        },
        quotas: {
          columns: {
            id: true,
            quotaKey: true,
            value: true,
          },
        },
        templates: {
          with: {
            template: {
              columns: { id: true, name: true },
            },
          },
        },
      },
    });

    return list.map((pkg) => {
      const mergedBenefits = [
        ...pkg.benefits.map((b) => ({
          id: b.id,
          benefitKey: b.benefitKey as BenefitKeyType,
          toggleValue: b.value,
          quotaValue: null,
        })),
        ...pkg.quotas.map((q) => ({
          id: q.id,
          benefitKey: q.quotaKey as BenefitKeyType,
          toggleValue: null,
          quotaValue: q.value,
        })),
      ];

      return {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        templates: pkg.templates,
        benefits: mergedBenefits,
      };
    });
  },
};
