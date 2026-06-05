import { ADMIN, MEMBER } from './role';

export const USER_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

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
    VALUE: USER_STATUS_VALUES.ACTIVE,
  },
  INACTIVE: {
    LABEL: 'Tidak Aktif',
    VALUE: USER_STATUS_VALUES.INACTIVE,
  },
} as const;
