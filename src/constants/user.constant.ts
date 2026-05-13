import { USER_ROLE_VALUES, USER_STATUS_VALUES } from '@/db/schema';

export const USER_ROLE = USER_ROLE_VALUES;

export const USER_ROLE_OPTIONS = {
  ADMIN: {
    LABEL: 'Admin',
    VALUE: USER_ROLE.ADMIN,
  },
  MEMBER: {
    LABEL: 'Member',
    VALUE: USER_ROLE.MEMBER,
  },
} as const;

export const USER_STATUS = USER_STATUS_VALUES;

export const USER_STATUS_OPTIONS = {
  ACTIVE: {
    LABEL: 'Aktif',
    VALUE: USER_STATUS.ACTIVE,
  },
  INACTIVE: {
    LABEL: 'Tidak Aktif',
    VALUE: USER_STATUS.INACTIVE,
  },
} as const;
