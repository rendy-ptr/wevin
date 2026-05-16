import { db } from '@/db';
import { benefits } from '@/db/schema';
import type { BenefitFilterParams } from '@/types/benefit.type';
import { and, count, eq, ilike } from 'drizzle-orm';

export const benefitRepository = {
  getAll: async ({
    search,
    type,
    page = 1,
    limit = 10,
  }: BenefitFilterParams) => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      search ? ilike(benefits.key, `%${search}%`) : undefined,
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
};
