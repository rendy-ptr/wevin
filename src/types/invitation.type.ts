import { InvitationStatusEnum } from '@/enums/invitation.enum';

export type InvitationFilterParams = {
  memberId?: number;
  search?: string;
  status?: InvitationStatusEnum;
  page?: number;
  limit?: number;
};
