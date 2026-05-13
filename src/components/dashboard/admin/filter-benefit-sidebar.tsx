'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { BENEFIT_TYPE_OPTIONS } from '@/constants/benefit.constant';
import { TBenefitType } from '@/types/benefit.type';
import { useState } from 'react';

interface FilterBenefitSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  typeFilter?: TBenefitType;
  onApply: (filters: { type?: TBenefitType }) => void;
  onReset: () => void;
}

export default function FilterBenefitSidebar({
  isOpen,
  onClose,
  typeFilter,
  onApply,
  onReset,
}: FilterBenefitSidebarProps) {
  const [localTypeFilter, setLocalTypeFilter] = useState<
    TBenefitType | undefined
  >(typeFilter);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalTypeFilter(typeFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply({
      type: localTypeFilter,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalTypeFilter(undefined);
    onReset();
  };

  const typeOptions = [
    {
      label: BENEFIT_TYPE_OPTIONS.TOGGLE.LABEL,
      value: BENEFIT_TYPE_OPTIONS.TOGGLE.VALUE,
    },
    {
      label: BENEFIT_TYPE_OPTIONS.QUOTA.LABEL,
      value: BENEFIT_TYPE_OPTIONS.QUOTA.VALUE,
    },
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
            {typeOptions.map((opt) => (
              <Button
                key={opt.value}
                onClick={() =>
                  setLocalTypeFilter(
                    localTypeFilter === opt.value ? undefined : opt.value,
                  )
                }
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-all ${
                  localTypeFilter === opt.value
                    ? 'bg-primary-dark shadow-primary-dark/10 hover:bg-primary-dark/90 text-white shadow-md'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
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
