import { activityLogs } from '@/db/schema';

export type TActivityLog = typeof activityLogs.$inferSelect;
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
