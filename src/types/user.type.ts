import {
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from '@/constants/user.constant';
import { users } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { BaseActivityLogModel } from './activity.type';
import { BasePackageBenefitModel } from './benefit.type';
import { BaseMemberProfileModel } from './member.type';
import { BasePackageModel } from './package.type';

export type BaseUserModel = InferSelectModel<typeof users>;
export type TUserRole =
  (typeof USER_ROLE_VALUES)[keyof typeof USER_ROLE_VALUES];
export type TUserStatus =
  (typeof USER_STATUS_VALUES)[keyof typeof USER_STATUS_VALUES];

export type UserWithRelationships = Omit<BaseUserModel, 'password'> & {
  profile: BaseMemberProfileModel & {
    package: BasePackageModel & {
      benefits: BasePackageBenefitModel[];
    };
  };
  activityLogs: BaseActivityLogModel[];
};
