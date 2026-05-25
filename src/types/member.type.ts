import { memberProfiles } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type BaseMemberProfileModel = InferSelectModel<typeof memberProfiles>;

export type MemberFilterParams = {
  search?: string;
  packageId?: number;
  status?: string;
  page?: number;
  limit?: number;
};
