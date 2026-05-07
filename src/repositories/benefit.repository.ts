import { BenefitType, SystemAction } from '@/constants/benefits';
import { db } from '@/db';
import { benefits } from '@/db/schema';
import type { BenefitFilterParams } from '@/types/benefit.type';
import { CreateUpdateBenefitFormValues } from '@/validations/admin/create-update-benefit';
import { and, count, eq, ilike, or } from 'drizzle-orm';

export const benefitRepository = {
  getAll: async ({
    search,
    type,
    page = 1,
    limit = 10,
  }: BenefitFilterParams) => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      search ? or(ilike(benefits.name, `%${search}%`)) : undefined,
      type ? eq(benefits.type, type) : undefined,
    );

    const items = await db.query.benefits.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (benefits, { desc }) => [desc(benefits.createdAt)],
    });

    const [totalResult] = await db
      .select({ value: count() })
      .from(benefits)
      .where(whereClause);

    return {
      items,
      total: totalResult.value,
    };
  },

  getById: async (id: number) => {
    const benefit = await db.query.benefits.findFirst({
      where: eq(benefits.id, id),
    });
    return benefit;
  },

  getByValue: async (data: { key: SystemAction; type: BenefitType }) => {
    const benefit = await db.query.benefits.findFirst({
      where: eq(benefits.key, data.key),
    });
    return benefit;
  },

  create: async (data: CreateUpdateBenefitFormValues) => {
    const [result] = await db.insert(benefits).values(data).returning();
    return result;
  },

  update: async (id: number, data: Partial<CreateUpdateBenefitFormValues>) => {
    const [result] = await db
      .update(benefits)
      .set(data)
      .where(eq(benefits.id, id))
      .returning();
    return result;
  },

  delete: async (id: number) => {
    const [result] = await db
      .delete(benefits)
      .where(eq(benefits.id, id))
      .returning();
    return result;
  },
};
