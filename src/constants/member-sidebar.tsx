import {
  BarChart3,
  FileHeart,
  LayoutDashboard,
  MessageSquareHeart,
  Settings,
  UserCheck,
  Users,
} from 'lucide-react';

export const SIDEBAR_LINKS = [
  { href: '/dashboard/member', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/member/buat', label: 'Buat Undangan', icon: FileHeart },
  { href: '/dashboard/member/kelola', label: 'Kelola Undangan', icon: Users },
  { href: '/dashboard/member/rsvp', label: 'RSVP Tracking', icon: UserCheck },
  {
    href: '/dashboard/member/guestbook',
    label: 'Guestbook',
    icon: MessageSquareHeart,
  },
  { href: '/dashboard/member/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/member/pengaturan', label: 'Pengaturan', icon: Settings },
];
