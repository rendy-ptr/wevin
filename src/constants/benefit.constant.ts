export const BENEFIT_TYPE = {
  TOGGLE: 'toggle',
  QUOTA: 'quota',
} as const;

export const SYSTEM_PERMISSIONS = {
  MUSIC_PLAYER: { label: 'Musik Latar Belakang', type: BENEFIT_TYPE.TOGGLE },
  RSVP_FORM: { label: 'Formulir RSVP', type: BENEFIT_TYPE.TOGGLE },
  GUESTBOOK: { label: 'Buku Tamu Digital', type: BENEFIT_TYPE.TOGGLE },
  DIGITAL_GIFT: { label: 'Kado Digital / Angpao', type: BENEFIT_TYPE.TOGGLE },
  LIVE_STREAMING: { label: 'Link Live Streaming', type: BENEFIT_TYPE.TOGGLE },
  REMOVED_WATERMARK: {
    label: 'Hapus Watermark Wevin',
    type: BENEFIT_TYPE.TOGGLE,
  },
  PASSWORD_PROTECT: { label: 'Proteksi Password', type: BENEFIT_TYPE.TOGGLE },
  CUSTOM_MESSAGE: { label: 'Pesan Pembuka Kustom', type: BENEFIT_TYPE.TOGGLE },
  ANALYTICS: { label: 'Analytics Tamu', type: BENEFIT_TYPE.TOGGLE },
  EXPORT_RSVP: { label: 'Export RSVP', type: BENEFIT_TYPE.TOGGLE },

  GUEST_LIMIT: { label: 'Batas Jumlah Tamu', type: BENEFIT_TYPE.QUOTA },
  PHOTO_LIMIT: { label: 'Batas Upload Foto', type: BENEFIT_TYPE.QUOTA },
  ACTIVE_DAYS: { label: 'Durasi Link Aktif (Hari)', type: BENEFIT_TYPE.QUOTA },
  TEMPLATE_LIMIT: {
    label: 'Jumlah Pilihan Template',
    type: BENEFIT_TYPE.QUOTA,
  },
} as const;

export type SystemAction = keyof typeof SYSTEM_PERMISSIONS;

export const SYSTEM_ACTIONS = Object.keys(SYSTEM_PERMISSIONS).reduce(
  (acc, key) => {
    acc[key as SystemAction] = key as SystemAction;
    return acc;
  },
  {} as Record<SystemAction, SystemAction>,
);

export const SYSTEM_ACTION_LABELS = Object.fromEntries(
  Object.entries(SYSTEM_PERMISSIONS).map(([key, def]) => [key, def.label]),
) as Record<SystemAction, string>;

export const SYSTEM_ACTION_TYPES = Object.fromEntries(
  Object.entries(SYSTEM_PERMISSIONS).map(([key, def]) => [key, def.type]),
) as Record<SystemAction, string>;
