import { db } from '@/db';
import { activityLogs } from '@/db/schema';
import type {
  ActivityFilterParams,
  ActivityIndexItem,
  BaseActivityLogModel,
} from '@/types/activity.type';
import {
  and,
  count,
  eq,
  gte,
  ilike,
  InferInsertModel,
  lte,
  or,
} from 'drizzle-orm';

export const activityRepository = {
  getAll: async ({
    search,
    startDate,
    endDate,
    action,
    page = 1,
    limit = 10,
  }: ActivityFilterParams): Promise<{
    items: ActivityIndexItem[];
    total: number;
  }> => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      search
        ? or(
            ilike(activityLogs.action, `%${search}%`),
            ilike(activityLogs.details, `%${search}%`),
          )
        : undefined,
      startDate ? gte(activityLogs.createdAt, startDate) : undefined,
      endDate ? lte(activityLogs.createdAt, endDate) : undefined,
      action ? eq(activityLogs.action, action) : undefined,
    );

    const items = await db.query.activityLogs.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (activityLogs, { desc }) => [desc(activityLogs.createdAt)],
      with: {
        user: {
          columns: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const [totalResult] = await db
      .select({ value: count() })
      .from(activityLogs)
      .where(whereClause);

    return {
      items: items as ActivityIndexItem[],
      total: totalResult.value,
    };
  },

  // getById: async (id: number): Promise<BaseActivityLogModel | undefined> => {
  //   const activity = await db.query.activityLogs.findFirst({
  //     where: eq(activityLogs.id, id),
  //   });
  //   return activity as BaseActivityLogModel;
  // },

  create: async (
    data: InferInsertModel<typeof activityLogs>,
  ): Promise<BaseActivityLogModel> => {
    const [activity] = await db.insert(activityLogs).values(data).returning();
    return activity;
  },
};
