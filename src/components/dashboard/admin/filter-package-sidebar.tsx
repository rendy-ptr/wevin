'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { PACKAGE_STATUS } from '@/constants/package.constant';
import { TPackageStatus } from '@/types/package.type';

interface FilterPackageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: TPackageStatus | undefined;
  onApply: (newFilters: { status?: TPackageStatus | undefined }) => void;
  onReset: () => void;
}

export default function FilterPackageSidebar({
  isOpen,
  onClose,
  statusFilter,
  onApply,
  onReset,
}: FilterPackageSidebarProps) {
  const [localStatusFilter, setLocalStatusFilter] = useState<
    TPackageStatus | undefined
  >(statusFilter);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalStatusFilter(statusFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply({
      status: localStatusFilter,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalStatusFilter(undefined);
    onReset();
  };

  const statusOptions = [
    { label: 'Aktif', value: PACKAGE_STATUS.ACTIVE },
    { label: 'Non-aktif', value: PACKAGE_STATUS.INACTIVE },
  ] as const;

  return (
    <SharedFilterSidebar
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Paket"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Status Paket
          </label>
          <div className="flex flex-col gap-2">
            {statusOptions.map((opt) => (
              <Button
                key={opt.value}
                onClick={() => setLocalStatusFilter(opt.value)}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                  localStatusFilter === opt.value
                    ? 'bg-primary-dark shadow-primary-dark/10 hover:bg-primary-dark/90 text-white shadow-md'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {localStatusFilter === opt.value && (
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SharedFilterSidebar>
  );
}
