export const BENEFITS_DATA = [
  {
    key: 'music_player',
    label: 'Musik Latar Belakang',
    type: 'toggle' as const,
  },
  { key: 'rsvp_form', label: 'Formulir RSVP', type: 'toggle' as const },
  { key: 'guestbook', label: 'Buku Tamu Digital', type: 'toggle' as const },
  {
    key: 'digital_gift',
    label: 'Kado Digital / Angpao',
    type: 'toggle' as const,
  },
  {
    key: 'live_streaming',
    label: 'Link Live Streaming',
    type: 'toggle' as const,
  },
  {
    key: 'removed_watermark',
    label: 'Hapus Watermark',
    type: 'toggle' as const,
  },
  {
    key: 'password_protect',
    label: 'Proteksi Password',
    type: 'toggle' as const,
  },
  {
    key: 'custom_message',
    label: 'Pesan Pembuka Kustom',
    type: 'toggle' as const,
  },
  { key: 'analytics', label: 'Analytics Tamu', type: 'toggle' as const },
  { key: 'export_rsvp', label: 'Export RSVP', type: 'toggle' as const },
  { key: 'guest_limit', label: 'Batas Jumlah Tamu', type: 'quota' as const },
  { key: 'photo_limit', label: 'Batas Upload Foto', type: 'quota' as const },
  {
    key: 'active_days',
    label: 'Durasi Link Aktif (Hari)',
    type: 'quota' as const,
  },
] as const;
