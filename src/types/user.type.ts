import {
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from '@/constants/user.constant';
import { users } from '@/db/schema';

export type TUser = typeof users.$inferSelect;
export type TUserRole =
  (typeof USER_ROLE_VALUES)[keyof typeof USER_ROLE_VALUES];
export type TUserStatus =
  (typeof USER_STATUS_VALUES)[keyof typeof USER_STATUS_VALUES];
