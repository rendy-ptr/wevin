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
  {
    href: '/dashboard/member/guestbooks',
    label: 'Buku Tamu',
    icon: MessageSquareHeart,
  },
  {
    href: '/dashboard/member/invitations',
    label: 'Undangan',
    icon: FileHeart,
  },
  {
    href: '/dashboard/member/manage-invitation',
    label: 'Kelola Undangan',
    icon: Users,
  },
  { href: '/dashboard/member/rsvp', label: 'RSVP Tracking', icon: UserCheck },
  { href: '/dashboard/member/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/member/settings', label: 'Pengaturan', icon: Settings },
];
