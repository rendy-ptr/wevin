import { BENEFITS_DATA } from '@/constants/benefit.constant';
import { db } from '@/db';
import { packageBenefits, packages, packageTemplates } from '@/db/schema';
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
    items: PackageIndexItem[];
    total: number;
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
              toggleValue: true,
              quotaValue: true,
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

    return {
      items: items as PackageIndexItem[],
      total: totalResult.value,
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
        await tx.insert(packageBenefits).values(
          benefits.map((b) => {
            const benefitDef = BENEFITS_DATA.find(
              (def) => def.key === b.benefitKey,
            );
            if (!benefitDef)
              throw new Error(
                `Benefit key "${b.benefitKey}" tidak ada di konstanta`,
              );

            return {
              packageId: newPackage.id,
              benefitKey: b.benefitKey,
              toggleValue:
                benefitDef.type === 'toggle' ? (b.toggleValue ?? null) : null,
              quotaValue:
                benefitDef.type === 'quota' ? (b.quotaValue ?? null) : null,
            };
          }),
        );
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
      await tx
        .delete(packageTemplates)
        .where(eq(packageTemplates.packageId, id));

      if (benefits?.length) {
        await tx.insert(packageBenefits).values(
          benefits.map((b) => {
            const benefitDef = BENEFITS_DATA.find(
              (def) => def.key === b.benefitKey,
            );
            if (!benefitDef)
              throw new Error(
                `Benefit key "${b.benefitKey}" tidak ada di konstanta`,
              );

            return {
              packageId: id,
              benefitKey: b.benefitKey,
              toggleValue:
                benefitDef.type === 'toggle' ? (b.toggleValue ?? null) : null,
              quotaValue:
                benefitDef.type === 'quota' ? (b.quotaValue ?? null) : null,
            };
          }),
        );
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
    return db.query.packages.findFirst({
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
            toggleValue: true,
            quotaValue: true,
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
    }) as Promise<PackageWithRelationships | undefined>;
  },

  getPackageActiveWithBenefits: async (): Promise<
    ActivePackageWithBenefits[]
  > => {
    return db.query.packages.findMany({
      where: eq(packages.isActive, true),
      columns: { id: true, name: true, price: true },
      with: {
        benefits: {
          columns: {
            id: true,
            benefitKey: true,
            toggleValue: true,
            quotaValue: true,
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
  },
};
