export const PACKAGE_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const PACKAGE_STATUS_OPTIONS = {
  ACTIVE: {
    LABEL: 'Aktif',
    VALUE: PACKAGE_STATUS_VALUES.ACTIVE,
  },
  INACTIVE: {
    LABEL: 'Tidak Aktif',
    VALUE: PACKAGE_STATUS_VALUES.INACTIVE,
  },
} as const;
