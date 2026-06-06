import { ADMIN, MEMBER } from './role';

export const ACTIVE = 'active' as const;
export const INACTIVE = 'inactive' as const;

export const USER_ROLE_OPTIONS = {
  ADMIN: {
    LABEL: 'Admin',
    VALUE: ADMIN,
  },
  MEMBER: {
    LABEL: 'Member',
    VALUE: MEMBER,
  },
} as const;

export const USER_STATUS_OPTIONS = {
  ACTIVE: {
    LABEL: 'Aktif',
    VALUE: ACTIVE,
  },
  INACTIVE: {
    LABEL: 'Tidak Aktif',
    VALUE: INACTIVE,
  },
} as const;
