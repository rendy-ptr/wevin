import {
  BarChart3,
  History,
  LayoutDashboard,
  LayoutTemplate,
  Package,
  Settings,
  Tag,
  Users,
} from 'lucide-react';

export const SIDEBAR_LINKS = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/member', label: 'Kelola Member', icon: Users },
  { href: '/dashboard/admin/package', label: 'Kelola Paket', icon: Package },
  { href: '/dashboard/admin/benefit', label: 'Kelola Benefit', icon: Tag },
  {
    href: '/dashboard/admin/template',
    label: 'Manage Template',
    icon: LayoutTemplate,
  },
  {
    href: '/dashboard/admin/analytics',
    label: 'Analytics Global',
    icon: BarChart3,
  },
  { href: '/dashboard/admin/logs', label: 'Logs & Activity', icon: History },
  { href: '/dashboard/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];
