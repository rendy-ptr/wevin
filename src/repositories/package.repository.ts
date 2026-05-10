import { db } from '@/db';
import { packageBenefits, packages } from '@/db/schema';
import type { PackageFilterParams } from '@/types/package.type';
import { CreateUpdatePackageFormValues } from '@/validations/admin/create-update-package';
import { and, count, eq, ilike } from 'drizzle-orm';

export const packageRepository = {
  getAll: async ({
    search,
    status,
    page = 1,
    limit = 10,
  }: PackageFilterParams) => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      search ? ilike(packages.name, `%${search}%`) : undefined,
      status !== undefined ? eq(packages.status, status) : undefined,
    );

    const items = await db.query.packages.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (packages, { desc }) => [desc(packages.createdAt)],
    });

    const [totalResult] = await db
      .select({ value: count() })
      .from(packages)
      .where(whereClause);

    return {
      items,
      total: totalResult.value,
    };
  },

  getById: async (id: number) => {
    const packageData = await db.query.packages.findFirst({
      where: eq(packages.id, id),
      with: {
        benefits: true,
      },
    });

    return packageData;
  },

  getByName: async (name: string) => {
    const packageData = await db.query.packages.findFirst({
      where: eq(packages.name, name),
    });

    return packageData;
  },

  create: async (payload: CreateUpdatePackageFormValues) => {
    const { benefits, ...packageData } = payload;

    return await db.transaction(async (tx) => {
      const [newPackage] = await tx
        .insert(packages)
        .values(packageData)
        .returning();

      if (benefits && benefits.length > 0) {
        await tx.insert(packageBenefits).values(
          benefits.map((b) => ({
            packageId: newPackage.id,
            benefitId: b.benefitId,
            value: b.value,
          })),
        );
      }

      return newPackage;
    });
  },

  update: async (id: number, payload: CreateUpdatePackageFormValues) => {
    const { benefits, ...packageData } = payload;

    return await db.transaction(async (tx) => {
      const [updatedPackage] = await tx
        .update(packages)
        .set(packageData)
        .where(eq(packages.id, id))
        .returning();

      await tx.delete(packageBenefits).where(eq(packageBenefits.packageId, id));

      if (benefits && benefits.length > 0) {
        await tx.insert(packageBenefits).values(
          benefits.map((b) => ({
            packageId: id,
            benefitId: b.benefitId,
            value: b.value,
          })),
        );
      }

      return updatedPackage;
    });
  },

  delete: async (id: number) => {
    const [result] = await db
      .delete(packages)
      .where(eq(packages.id, id))
      .returning();
    return result;
  },
};
