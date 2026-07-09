export const TOGGLE_BENEFITS_DATA = [
  // {
  //   key: 'music_player',
  //   label: 'Musik Latar Belakang',
  //   type: 'toggle' as const,
  // },
  { key: 'rsvp_form', label: 'Formulir RSVP', type: 'toggle' as const },
  { key: 'guestbook', label: 'Buku Tamu Digital', type: 'toggle' as const },
  // {
  //   key: 'live_streaming',
  //   label: 'Link Live Streaming',
  //   type: 'toggle' as const,
  // },
  { key: 'analytics', label: 'Analytics Tamu', type: 'toggle' as const },
  { key: 'export_rsvp', label: 'Export RSVP', type: 'toggle' as const },
] as const;

export const QUOTA_BENEFITS_DATA = [
  { key: 'photo_limit', label: 'Batas Upload Foto', type: 'quota' as const },
  {
    key: 'active_days',
    label: 'Durasi Link Aktif (Hari)',
    type: 'quota' as const,
  },
] as const;

export const BENEFITS_DATA = [
  ...TOGGLE_BENEFITS_DATA,
  ...QUOTA_BENEFITS_DATA,
] as const;
