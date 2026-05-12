import { db } from '@/db';
import {
  memberProfiles,
  TUserStatusEnum,
  USER_ROLE_ENUM,
  users,
} from '@/db/schema';
import { MemberFilterParams } from '@/types/member.type';
import { CreateUpdateMemberFormValues } from '@/validations/admin/create-update-member';
import { and, count, eq, ilike, inArray, isNull } from 'drizzle-orm';

export const memberRepository = {
  getAll: async ({
    search,
    packageId,
    page = 1,
    limit = 10,
    status,
  }: MemberFilterParams) => {
    const offset = (page - 1) * limit;

    let matchingUserIds: number[] | undefined = undefined;

    if (packageId !== undefined && packageId !== null) {
      const profiles = await db.query.memberProfiles.findMany({
        where: eq(memberProfiles.packageId, packageId),
        columns: { userId: true },
      });
      matchingUserIds = profiles.map((p) => p.userId);

      if (matchingUserIds.length === 0) {
        return { items: [], total: 0 };
      }
    }

    const whereClause = and(
      eq(users.role, USER_ROLE_ENUM.MEMBER),
      isNull(users.deletedAt),
      search ? ilike(users.name, `%${search}%`) : undefined,
      status ? eq(users.status, status as TUserStatusEnum) : undefined,
      matchingUserIds ? inArray(users.id, matchingUserIds) : undefined,
    );

    const items = await db.query.users.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      columns: {
        password: false,
      },
      with: {
        profile: {
          with: {
            package: true,
          },
        },
      },
    });

    const [totalResult] = await db
      .select({ value: count() })
      .from(users)
      .where(whereClause);

    return {
      items,
      total: totalResult.value,
    };
  },

  create: async (
    payload: CreateUpdateMemberFormValues & {
      password: string;
    },
  ) => {
    return db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: USER_ROLE_ENUM.MEMBER,
        })
        .returning({ id: users.id, name: users.name, email: users.email });

      await tx.insert(memberProfiles).values({
        userId: newUser.id,
        packageId: payload.packageId,
      });

      return newUser;
    });
  },

  update: async (
    id: number,
    payload: Omit<CreateUpdateMemberFormValues, 'email'>,
  ) => {
    return db.transaction(async (tx) => {
      const [updatedUser] = await tx
        .update(users)
        .set({
          name: payload.name,
        })
        .where(eq(users.id, id))
        .returning({ id: users.id, name: users.name, email: users.email });

      await tx
        .update(memberProfiles)
        .set({
          packageId: payload.packageId,
        })
        .where(eq(memberProfiles.userId, id));

      return updatedUser;
    });
  },

  delete: async (id: number) => {
    const [deletedUser] = await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id, name: users.name, email: users.email });
    return deletedUser;
  },

  updateStatus: async (id: number, status: TUserStatusEnum) => {
    const [updatedUser] = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        status: users.status,
      });
    return updatedUser;
  },
};
