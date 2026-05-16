export const USER_ROLE_VALUES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export const USER_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const USER_ROLE_OPTIONS = {
  ADMIN: {
    LABEL: 'Admin',
    VALUE: USER_ROLE_VALUES.ADMIN,
  },
  MEMBER: {
    LABEL: 'Member',
    VALUE: USER_ROLE_VALUES.MEMBER,
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
