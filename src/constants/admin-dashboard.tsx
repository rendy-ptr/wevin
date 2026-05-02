import { BarChart3, FileHeart, TrendingUp, Users } from 'lucide-react';

export const ANALYTICS_DATA = [
  { month: 'Jan', members: 120, invitations: 450, rsvp: 380 },
  { month: 'Feb', members: 135, invitations: 520, rsvp: 440 },
  { month: 'Mar', members: 160, invitations: 680, rsvp: 580 },
  { month: 'Apr', members: 190, invitations: 820, rsvp: 720 },
  { month: 'Mei', members: 220, invitations: 950, rsvp: 850 },
  { month: 'Jun', members: 250, invitations: 1100, rsvp: 980 },
];

export const PACKAGE_DISTRIBUTION = [
  { name: 'Kenangan', value: 45, fill: '#E8D4D0' },
  { name: 'Bahagia', value: 40, fill: '#C9A0A0' },
  { name: 'Selamanya', value: 15, fill: '#C9A84C' },
];

export const RECENT_ACTIVITY = [
  {
    id: 1,
    member: 'Budi & Ani',
    action: 'Membuat undangan baru',
    time: '2 jam lalu',
  },
  {
    id: 2,
    member: 'Rina & Doni',
    action: 'Upgrade ke paket Selamanya',
    time: '5 jam lalu',
  },
  {
    id: 3,
    member: 'Ahmad & Siti',
    action: 'Mendapatkan 45 RSVP',
    time: '1 hari lalu',
  },
  {
    id: 4,
    member: 'Joko & Dwi',
    action: 'Membuat undangan baru',
    time: '2 hari lalu',
  },
];

export const ADMIN_STATS = [
  {
    label: 'Total Member',
    value: '250',
    change: '+12% bulan ini',
    icon: Users,
    color: 'text-primary',
  },
  {
    label: 'Total Undangan',
    value: '1.2K',
    change: '+25% bulan ini',
    icon: FileHeart,
    color: 'text-accent',
  },
  {
    label: 'Avg RSVP Rate',
    value: '89%',
    change: '+5% dari bulan lalu',
    icon: BarChart3,
    color: 'text-primary-dark',
  },
  {
    label: 'Revenue',
    value: 'Rp 15.2M',
    change: '+32% bulan ini',
    icon: TrendingUp,
    color: 'text-accent',
  },
];
