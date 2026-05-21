import {
  History,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from 'lucide-react';

export const SIDEBAR_LINKS = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/member', label: 'Kelola Member', icon: Users },
  { href: '/dashboard/admin/package', label: 'Kelola Paket', icon: Package },
  { href: '/dashboard/admin/logs', label: 'Logs & Activity', icon: History },
  { href: '/dashboard/admin/settings', label: 'Pengaturan', icon: Settings },
];
