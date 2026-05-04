export const BENEFIT_TYPES = {
  TOGGLE: 'toggle',
  QUOTA: 'quota',
} as const;

export const BENEFIT_TYPE_LABELS: Record<BenefitType, string> = {
  toggle: 'Toggle',
  quota: 'Quota',
};

export type BenefitType = (typeof BENEFIT_TYPES)[keyof typeof BENEFIT_TYPES];

export const SYSTEM_ACTIONS = {
  // ── Toggle
  MUSIC_PLAYER: 'MUSIC_PLAYER',
  RSVP_FORM: 'RSVP_FORM',
  GUESTBOOK: 'GUESTBOOK',
  DIGITAL_GIFT: 'DIGITAL_GIFT',
  LIVE_STREAMING: 'LIVE_STREAMING',
  REMOVED_WATERMARK: 'REMOVED_WATERMARK',
  PASSWORD_PROTECT: 'PASSWORD_PROTECT',
  CUSTOM_MESSAGE: 'CUSTOM_MESSAGE',
  ANALYTICS: 'ANALYTICS',
  EXPORT_RSVP: 'EXPORT_RSVP',

  // ── Quota
  GUEST_LIMIT: 'GUEST_LIMIT',
  PHOTO_LIMIT: 'PHOTO_LIMIT',
  ACTIVE_DAYS: 'ACTIVE_DAYS',
  TEMPLATE_LIMIT: 'TEMPLATE_LIMIT',
} as const;

export type SystemAction = (typeof SYSTEM_ACTIONS)[keyof typeof SYSTEM_ACTIONS];

export const SYSTEM_ACTION_LABELS: Record<SystemAction, string> = {
  // Toggle
  MUSIC_PLAYER: 'Musik Latar Belakang',
  RSVP_FORM: 'Formulir RSVP',
  GUESTBOOK: 'Buku Tamu Digital',
  DIGITAL_GIFT: 'Kado Digital / Angpao',
  LIVE_STREAMING: 'Link Live Streaming',
  REMOVED_WATERMARK: 'Hapus Watermark Wevin',
  PASSWORD_PROTECT: 'Proteksi Password Undangan',
  CUSTOM_MESSAGE: 'Pesan Pembuka Kustom',
  ANALYTICS: 'Analytics Tamu',
  EXPORT_RSVP: 'Export RSVP ke Excel',

  // Quota
  GUEST_LIMIT: 'Batas Jumlah Tamu',
  PHOTO_LIMIT: 'Batas Upload Foto',
  ACTIVE_DAYS: 'Durasi Link Aktif (hari)',
  TEMPLATE_LIMIT: 'Jumlah Pilihan Template',
};

export const SYSTEM_ACTION_TYPES: Record<SystemAction, BenefitType> = {
  // Toggle
  MUSIC_PLAYER: 'toggle',
  RSVP_FORM: 'toggle',
  GUESTBOOK: 'toggle',
  DIGITAL_GIFT: 'toggle',
  LIVE_STREAMING: 'toggle',
  REMOVED_WATERMARK: 'toggle',
  PASSWORD_PROTECT: 'toggle',
  CUSTOM_MESSAGE: 'toggle',
  ANALYTICS: 'toggle',
  EXPORT_RSVP: 'toggle',

  // Quota
  GUEST_LIMIT: 'quota',
  PHOTO_LIMIT: 'quota',
  ACTIVE_DAYS: 'quota',
  TEMPLATE_LIMIT: 'quota',
};
