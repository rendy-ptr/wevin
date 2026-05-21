import {
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from '@/constants/user.constant';
import { users } from '@/db/schema';
import { TActivityLog } from './activity.type';

export type TUser = typeof users.$inferSelect;
export type TUserRole =
  (typeof USER_ROLE_VALUES)[keyof typeof USER_ROLE_VALUES];
export type TUserStatus =
  (typeof USER_STATUS_VALUES)[keyof typeof USER_STATUS_VALUES];

export type TUserRelated = TUser & {
  profile: {
    package: {
      id: string;
      name: string;
    };
  };
  activityLogs: TActivityLog[];
};
