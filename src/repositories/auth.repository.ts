import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const authRepository = {
  getUserByEmail: async (email: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  },

  getUserById: async (id: number) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return user;
  },
};
