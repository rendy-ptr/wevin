import { db } from '@/db';
import { activityLogs, users } from '@/db/schema';
import { ActivityFilterParams } from '@/types/activity.type';
import { BaseUserModel } from '@/types/user.type';
import { and, count, eq, gte, ilike, lte, or } from 'drizzle-orm';

export const settingRepository = {
  getPassword: async (id: number) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        password: true,
      },
    });
    return user;
  },

  updatePassword: async ({
    id,
    password,
  }: Pick<BaseUserModel, 'id' | 'password'>) => {
    const [updatedUser] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });
    return updatedUser;
  },

  updateEmail: async ({ id, email }: Pick<BaseUserModel, 'id' | 'email'>) => {
    const [updatedUser] = await db
      .update(users)
      .set({ email })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      });
    return updatedUser;
  },

  updateName: async ({ id, name }: Pick<BaseUserModel, 'id' | 'name'>) => {
    const [updatedUser] = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      });
    return updatedUser;
  },

  getSettingActivityLogs: async (
    { search, startDate, endDate, action, page, limit }: ActivityFilterParams,
    userId: number,
  ) => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      userId ? eq(activityLogs.userId, userId) : undefined,
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
      items,
      total: totalResult.value,
    };
  },
};
