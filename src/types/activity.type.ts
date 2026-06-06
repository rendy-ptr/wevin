import { activityLogs } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { BaseUserModel } from './user.type';

export type BaseActivityLogModel = InferSelectModel<typeof activityLogs>;
export type TActivityAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT';

export type ActivityFilterParams = {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  action?: string;
  page: number;
  limit: number;
};

export type ActivityIndexItem = Omit<BaseActivityLogModel, 'updatedAt'> & {
  user: Pick<BaseUserModel, 'id' | 'name' | 'email' | 'role'>;
};
