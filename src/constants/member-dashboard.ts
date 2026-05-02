import { BarChart3, Eye, FileHeart, UserCheck } from 'lucide-react';
export const VIEW_DATA = [
  { date: '1 Jun', views: 245 },
  { date: '2 Jun', views: 320 },
  { date: '3 Jun', views: 280 },
  { date: '4 Jun', views: 450 },
  { date: '5 Jun', views: 380 },
  { date: '6 Jun', views: 520 },
];

export const RSVP_DATA = [
  { name: 'Konfirmasi Hadir', value: 45, fill: '#C9A0A0' },
  { name: 'Belum Konfirmasi', value: 15, fill: '#E8D4D0' },
  { name: 'Tidak Hadir', value: 5, fill: '#C9A84C' },
];

export const RECENT_INVITATIONS = [
  {
    id: 1,
    title: 'Pernikahan Kami',
    views: 520,
    rsvp: 45,
    date: 'Dibuat 2 minggu lalu',
  },
  {
    id: 2,
    title: 'Cinta Sejati',
    views: 340,
    rsvp: 32,
    date: 'Dibuat 1 bulan lalu',
  },
  {
    id: 3,
    title: 'Bahagia Bersama',
    views: 210,
    rsvp: 18,
    date: 'Dibuat 2 bulan lalu',
  },
];

export const MEMBER_STATS = [
  {
    label: 'Total Undangan',
    value: '3',
    icon: FileHeart,
    color: 'text-primary',
  },
  { label: 'Total Views', value: '1.2K', icon: Eye, color: 'text-accent' },
  {
    label: 'Total RSVP',
    value: '95',
    icon: UserCheck,
    color: 'text-primary-dark',
  },
  { label: 'Paket', value: 'Bahagia', icon: BarChart3, color: 'text-accent' },
];
