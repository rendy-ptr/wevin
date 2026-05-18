'use client';

import FilterActivitySidebar from '@/components/dashboard/admin/filter-activity-sidebar';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACTIVITY_ACTION_COLOR } from '@/constants/activity.constant';
import { useGetActivities } from '@/hooks/api/use-activity';
import { formatDateTime } from '@/lib/date';
import { ActivityFilterParams, TActivityLog } from '@/types/activity.type';
import { Filter, Heart, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function LogsActivityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<ActivityFilterParams>({
    search: '',
    startDate: undefined,
    endDate: undefined,
    action: undefined,
    page: 1,
    limit: 10,
  });

  const { data: activityData, isLoading } = useGetActivities({
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Logs & Activity
          </h1>
          <p className="text-muted-foreground text-sm">
            Pantau seluruh riwayat aktivitas yang terjadi di dalam sistem.
          </p>
        </div>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
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
              {isLoading ? (
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
          isLoading={isLoading}
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
  );
}
