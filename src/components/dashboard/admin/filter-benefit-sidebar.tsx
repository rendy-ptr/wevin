'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import {
  BENEFIT_TYPE_LABELS,
  BENEFIT_TYPES,
  BenefitType,
} from '@/constants/benefits';
import { useState } from 'react';

interface FilterBenefitSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  typeFilter: BenefitType | 'all';
  onApply: (type: BenefitType | 'all') => void;
  onReset: () => void;
}

export default function FilterBenefitSidebar({
  isOpen,
  onClose,
  typeFilter,
  onApply,
  onReset,
}: FilterBenefitSidebarProps) {
  const [localTypeFilter, setLocalTypeFilter] = useState<BenefitType | 'all'>(
    typeFilter,
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalTypeFilter(typeFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply(localTypeFilter);
    onClose();
  };

  const handleReset = () => {
    setLocalTypeFilter('all');
    onReset();
  };

  const filterOptions = [
    { label: 'Semua Tipe', value: 'all' },
    ...Object.values(BENEFIT_TYPES).map((type) => ({
      label: BENEFIT_TYPE_LABELS[type],
      value: type,
    })),
  ];

  return (
    <SharedFilterSidebar
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Benefit"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Tipe Benefit
          </label>
          <div className="flex flex-col gap-2">
            {filterOptions.map((opt) => (
              <Button
                key={opt.value}
                onClick={() =>
                  setLocalTypeFilter(opt.value as BenefitType | 'all')
                }
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                  localTypeFilter === opt.value
                    ? 'bg-primary/5 text-primary border-primary/30 ring-primary/30 border ring-1'
                    : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 border border-transparent'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {localTypeFilter === opt.value && (
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
