export const PACKAGE_STATUS_ACTIVE = 'active' as const;
export const PACKAGE_STATUS_INACTIVE = 'inactive' as const;

export const PACKAGE_STATUS_OPTIONS = {
  ACTIVE: {
    LABEL: 'Aktif',
    VALUE: PACKAGE_STATUS_ACTIVE,
  },
  INACTIVE: {
    LABEL: 'Tidak Aktif',
    VALUE: PACKAGE_STATUS_INACTIVE,
  },
} as const;
