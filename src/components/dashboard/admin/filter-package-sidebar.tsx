'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FilterPackageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isActiveFilter: boolean | undefined;
  isPopularFilter: boolean | undefined;
  onApply: (newFilters: {
    isActive?: boolean | undefined;
    isPopular?: boolean | undefined;
  }) => void;
  onReset: () => void;
}

export default function FilterPackageSidebar({
  isOpen,
  onClose,
  isActiveFilter,
  isPopularFilter,
  onApply,
  onReset,
}: FilterPackageSidebarProps) {
  const [localIsActiveFilter, setLocalIsActiveFilter] = useState<
    boolean | undefined
  >(isActiveFilter);
  const [localIsPopularFilter, setLocalIsPopularFilter] = useState<
    boolean | undefined
  >(isPopularFilter);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalIsActiveFilter(isActiveFilter);
    setLocalIsPopularFilter(isPopularFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply({
      isActive: localIsActiveFilter,
      isPopular: localIsPopularFilter,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalIsActiveFilter(undefined);
    setLocalIsPopularFilter(undefined);
    onReset();
  };

  const statusOptions = [
    { label: 'Aktif', value: true },
    { label: 'Non-aktif', value: false },
  ] as const;

  const popularOptions = [
    { label: 'Populer', value: true },
    { label: 'Tidak Populer', value: false },
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
            {statusOptions.map((opt, index) => (
              <Button
                key={index}
                onClick={() => setLocalIsActiveFilter(opt.value)}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                  localIsActiveFilter === opt.value
                    ? 'bg-primary-dark shadow-primary-dark/10 hover:bg-primary-dark/90 text-white shadow-md'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {localIsActiveFilter === opt.value && (
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Status Paket
          </label>
          <div className="flex flex-col gap-2">
            {popularOptions.map((opt, index) => (
              <Button
                key={index}
                onClick={() => setLocalIsPopularFilter(opt.value)}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                  localIsPopularFilter === opt.value
                    ? 'bg-primary-dark shadow-primary-dark/10 hover:bg-primary-dark/90 text-white shadow-md'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {localIsPopularFilter === opt.value && (
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
