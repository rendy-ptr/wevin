import { BenefitType, SystemAction } from '@/constants/benefits';
import { db } from '@/db';
import { benefits } from '@/db/schema';
import { CreateUpdateBenefitFormValues } from '@/validations/admin/create-update-benefit';
import { and, eq, ilike, or } from 'drizzle-orm';

export const benefitRepository = {
  getAll: async (search?: string, type?: BenefitType) => {
    return await db.query.benefits.findMany({
      where: and(
        search ? or(ilike(benefits.name, `%${search}%`)) : undefined,
        type ? eq(benefits.type, type) : undefined,
      ),
      orderBy: (benefits, { desc }) => [desc(benefits.createdAt)],
    });
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
