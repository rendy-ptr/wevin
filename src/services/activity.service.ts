import { activityLogs } from '@/db/schema';
import { activityRepository } from '@/repositories/activity.repository';
import {
  ActivityFilterParams,
  ActivityIndexItem,
  BaseActivityLogModel,
} from '@/types/activity.type';
import { InferInsertModel } from 'drizzle-orm';

export const activityService = {
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
    return await activityRepository.getAll({
      search,
      startDate,
      endDate,
      action,
      page,
      limit,
    });
  },

  // getById: async (id: number) => {
  //   const activity = await activityRepository.getById(id);

  //   if (!activity) {
  //     throw new NotFoundError('Activity not found');
  //   }

  //   return activity;
  // },

  log: async (
    data: InferInsertModel<typeof activityLogs>,
  ): Promise<BaseActivityLogModel> => {
    return await activityRepository.create(data);
  },
};
