import { memberProfiles } from '@/db/schema';
import { TPackage } from './package.type';
import { TUser } from './user.type';

export type TMember = typeof memberProfiles.$inferSelect;

export type UserMember = Omit<TUser, 'password'> & {
  profile:
    | (TMember & {
        package: TPackage;
      })
    | null;
};

export type MemberFilterParams = {
  search?: string;
  packageId?: number;
  status?: string;
  page?: number;
  limit?: number;
};
