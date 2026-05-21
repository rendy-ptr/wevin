import { db } from '@/db';
import { activityLogs, users } from '@/db/schema';
import { ActivityFilterParams } from '@/types/activity.type';
import { TUser } from '@/types/user.type';
import { and, count, eq, gte, ilike, lte, or } from 'drizzle-orm';

export const settingRepository = {
  getSessionUser: async (id: number) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false,
      },
      with: {
        profile: {
          with: {
            package: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return user;
  },

  getPassword: async (id: number) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: true,
      },
    });
    return user;
  },

  getUserById: async (id: number) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return user;
  },

  updatePassword: async ({ id, password }: Pick<TUser, 'id' | 'password'>) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        email: true,
        name: true,
      },
    });
    await db.update(users).set({ password }).where(eq(users.id, id));
    return user;
  },

  updateNameAndEmail: async ({
    id,
    name,
    email,
  }: Pick<TUser, 'id' | 'name' | 'email'>) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    await db.update(users).set({ name, email }).where(eq(users.id, id));
    return user;
  },

  getAllActivityLogs: async ({
    userId,
    search,
    startDate,
    endDate,
    action,
    page,
    limit,
  }: ActivityFilterParams) => {
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
