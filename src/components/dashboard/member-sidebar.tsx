'use client';

import { Button } from '@/components/ui/button';
import { SIDEBAR_LINKS } from '@/constants/member-sidebar';
import { useToast } from '@/hooks/use-toast';
import { SessionUser } from '@/lib/auth';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import { isAxiosError } from 'axios';
import { Heart, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface MemberSidebarProps {
  user: SessionUser;
}

export function MemberSidebar({ user }: MemberSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      toast({
        title: 'Berhasil keluar',
        description: 'Anda berhasil keluar dari akun',
      });
      router.push('/login');
      router.refresh();
    } catch (error) {
      let message = 'Gagal keluar. Silakan coba lagi.';
      if (isAxiosError(error)) {
        message = error.response?.data?.message || 'Gagal keluar.';
      }
      toast({
        variant: 'destructive',
        title: 'Gagal keluar',
        description: message,
      });
    }
  };

  return (
    <>
      <div className="bg-sidebar border-sidebar-border fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b px-4 lg:hidden">
        <Link href="/dashboard/member" className="flex items-center gap-2">
          <Heart className="text-primary fill-primary h-6 w-6" />
          <span className="text-sidebar-foreground font-serif text-lg font-bold">
            {process.env.NEXT_PUBLIC_APP_ALIAS ||
              process.env.NEXT_PUBLIC_APP_NAME ||
              'Configure on ENV'}
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'bg-sidebar border-sidebar-border fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r transition-transform duration-300',
          'lg:z-30 lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-sidebar-border flex h-16 items-center border-b px-6">
          <Link href="/dashboard/member" className="flex items-center gap-2">
            <Heart className="text-primary fill-primary h-6 w-6" />
            <span className="text-sidebar-foreground font-serif text-xl font-bold">
              {process.env.NEXT_PUBLIC_APP_ALIAS ||
                process.env.NEXT_PUBLIC_APP_NAME ||
                'Configure on ENV'}
            </span>
          </Link>
        </div>

        <div className="px-4 py-4">
          <div className="bg-accent/10 border-accent/30 rounded-xl border px-4 py-3">
            <p className="text-muted-foreground mb-1 text-xs">Paket Aktif</p>
            <p className="text-accent font-serif font-semibold">Bahagia</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {SIDEBAR_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard/member' &&
                  pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent',
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-sidebar-border border-t p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
              <span className="text-primary-dark font-serif font-semibold">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground truncate font-medium">
                {user.name}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-sidebar-border hover:bg-sidebar-accent hover:text-primary w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>
    </>
  );
}
