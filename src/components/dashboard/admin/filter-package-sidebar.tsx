'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    { label: 'Aktif', value: 'true' },
    { label: 'Non-aktif', value: 'false' },
  ] as const;

  const popularOptions = [
    { label: 'Populer', value: 'true' },
    { label: 'Tidak Populer', value: 'false' },
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
          <Select
            value={
              localIsActiveFilter === undefined
                ? ''
                : String(localIsActiveFilter)
            }
            onValueChange={(val) =>
              setLocalIsActiveFilter(val === '' ? undefined : val === 'true')
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Status Paket" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Status Populer
          </label>
          <Select
            value={
              localIsPopularFilter === undefined
                ? ''
                : String(localIsPopularFilter)
            }
            onValueChange={(val) =>
              setLocalIsPopularFilter(val === '' ? undefined : val === 'true')
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Status Populer" />
            </SelectTrigger>
            <SelectContent>
              {popularOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </SharedFilterSidebar>
  );
}
