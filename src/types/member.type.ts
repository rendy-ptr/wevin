import { TMember, TPackage, TUser } from '@/db/schema';

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
