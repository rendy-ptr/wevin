'use client';

import EditPasswordModal from '@/components/dashboard/admin/edit-password-modal';
import EditProfileModal from '@/components/dashboard/admin/edit-profile-modal';
import FilterActivitySidebar from '@/components/dashboard/admin/filter-activity-sidebar';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ACTIVITY_ACTION_COLOR } from '@/constants/activity.constant';
import { useGetAllActivityLogs, useGetSettings } from '@/hooks/api/use-setting';
import { formatDateTime } from '@/lib/date';
import { ActivityFilterParams, TActivityLog } from '@/types/activity.type';
import { ModalType } from '@/types/modal.type';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Filter,
  Heart,
  KeyRound,
  Loader2,
  Package,
  Search,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SettingsPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<ActivityFilterParams>({
    userId: undefined,
    search: '',
    startDate: undefined,
    endDate: undefined,
    action: undefined,
    page: 1,
    limit: 10,
  });
  const { data: user, isLoading: isLoadingGetSettings } = useGetSettings();

  const { data: activityData, isLoading: isLoadingGetActivities } =
    useGetAllActivityLogs({
      userId: user?.id,
      search: filters.search,
      startDate: filters.startDate,
      endDate: filters.endDate,
      action: filters.action,
      page: filters.page,
      limit: filters.limit,
    });

  const activities = activityData?.items || [];
  const total = activityData?.total || 0;
  const totalPages = Math.ceil(total / filters.limit);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleApplyFilter = (newFilters: {
    startDate?: Date;
    endDate?: Date;
    action?: string;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({
      userId: undefined,
      search: '',
      startDate: undefined,
      endDate: undefined,
      action: undefined,
      page: 1,
      limit: 10,
    });
    setSearchTerm('');
  };

  const getActionColor = (action: string) => {
    return (
      ACTIVITY_ACTION_COLOR[
        action.toLowerCase() as keyof typeof ACTIVITY_ACTION_COLOR
      ] || 'bg-secondary/20 text-foreground'
    );
  };

  if (isLoadingGetSettings) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Heart className="text-primary fill-primary h-8 w-8" />
        <span className="text-primary text-xl font-bold">
          Akun tidak ditemukan
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola profil, keamanan, dan aktivitas akun Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveModal('profile')}
            className="border-border hover:bg-secondary/50 text-foreground h-10 gap-2 text-xs font-medium tracking-wide transition-all active:scale-95"
          >
            <User className="text-muted-foreground h-4 w-4" />
            Perbarui Profil
          </Button>
          <Button
            type="button"
            onClick={() => setActiveModal('password')}
            className="bg-primary hover:bg-primary-dark shadow-primary/20 text-primary-foreground h-10 gap-2 text-xs font-medium tracking-wide shadow-lg transition-all active:scale-95"
          >
            <KeyRound className="h-4 w-4" />
            Perbarui Password
          </Button>
        </div>
      </div>

      <div className="grid auto-rows-min grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bg-background border-border shadow-sm md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <User className="text-primary h-5 w-5" />
              <CardTitle>Informasi Profil</CardTitle>
            </div>
            <CardDescription>
              Detail lengkap nama lengkap dan email akun Anda saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="bg-primary/10 text-primary-dark flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Nama Lengkap
                  </Label>
                  <p className="mt-1 text-sm font-medium">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p className="mt-1 text-sm font-medium">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Peran (Role)
                  </Label>
                  <div className="mt-1 flex items-center">
                    <span className="bg-secondary/30 text-foreground inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Bergabung Sejak
                  </Label>
                  <p className="mt-1 text-sm font-medium">
                    {user.createdAt
                      ? format(new Date(user.createdAt), 'dd MMMM yyyy', {
                          locale: id,
                        })
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-sm md:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="text-primary h-5 w-5" />
              <CardTitle>Paket Aktif</CardTitle>
            </div>
            <CardDescription>Status langganan Anda saat ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-primary-dark text-3xl font-bold tracking-tight">
                {user.profile?.package?.name || 'Gratis'}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Akses ke fitur dasar
              </p>
            </div>
            <Button className="w-full" variant="outline">
              Upgrade Paket
            </Button>
          </CardContent>
        </Card>

        <div className="bg-background border-border overflow-hidden rounded-xl border md:col-span-3">
          <div className="border-border border-b p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Cari aksi atau detail..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border-border focus:ring-primary h-10 bg-transparent pl-9 text-sm focus:ring-1"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark h-10 cursor-pointer px-4 transition-colors"
                onClick={() => setIsFilterSidebarOpen(true)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground border-border border-b text-[11px] font-bold tracking-wider uppercase">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Aksi</th>
                  <th className="px-6 py-4 font-semibold">Entitas</th>
                  <th className="px-6 py-4 font-semibold">Detail</th>
                  <th className="px-6 py-4 font-semibold">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {isLoadingGetActivities ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        <p className="text-muted-foreground text-xs font-medium">
                          Memuat data riwayat...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : activities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Heart className="text-primary fill-primary h-8 w-8" />
                        <p className="text-muted-foreground text-xs font-medium">
                          Tidak ada aktivitas yang ditemukan.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activities.map(
                    (
                      log: TActivityLog & {
                        user?: { name: string; email: string } | null;
                      },
                    ) => (
                      <tr
                        key={log.id}
                        className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-foreground font-medium">
                              {log.user?.name || 'Sistem'}
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              {log.user?.email || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${getActionColor(log.action)}`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-[10px] font-medium tracking-wide">
                            {log.entityType}{' '}
                            {log.entityId ? `#${log.entityId}` : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-muted-foreground max-w-xs text-xs">
                            {log.details || '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-muted-foreground text-xs">
                            {formatDateTime(log.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={filters.page}
            totalPages={totalPages}
            limit={filters.limit}
            totalItems={total}
            isLoading={isLoadingGetActivities}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            onLimitChange={(limit) =>
              setFilters((prev) => ({ ...prev, limit, page: 1 }))
            }
          />
        </div>
        <FilterActivitySidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          startDateFilter={filters.startDate}
          endDateFilter={filters.endDate}
          actionFilter={filters.action}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />
      </div>

      <EditProfileModal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        user={user}
      />

      <EditPasswordModal
        isOpen={activeModal === 'password'}
        onClose={() => setActiveModal(null)}
        userId={user.id}
      />
    </div>
  );
}
