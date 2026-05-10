'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { PACKAGE_STATUS, TPackageStatus } from '@/db/schema';

interface FilterPackageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: TPackageStatus | undefined;
  onApply: (status?: TPackageStatus) => void;
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
    onApply(localStatusFilter);
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
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                  localStatusFilter === opt.value
                    ? 'bg-primary/5 text-primary border-primary/30 ring-primary/30 hover:bg-primary/10 border ring-1'
                    : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 border border-transparent'
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
