import { db } from '@/db';
import { templates } from '@/db/schema';
import { asc } from 'drizzle-orm';

export const templateRepository = {
  getAll: async () => {
    return await db.query.templates.findMany({
      orderBy: [asc(templates.name)],
    });
  },

  getById: async (id: number) => {
    return await db.query.templates.findFirst({
      where: (templates, { eq }) => eq(templates.id, id),
    });
  },
};
