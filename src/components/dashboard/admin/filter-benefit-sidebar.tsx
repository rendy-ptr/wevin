'use client';

import { Button } from '@/components/ui/button';
import {
  BENEFIT_TYPE_LABELS,
  BENEFIT_TYPES,
  BenefitType,
} from '@/constants/benefits';
import { Filter, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  typeFilter: BenefitType | 'all';
  onApply: (type: BenefitType | 'all') => void;
  onReset: () => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  typeFilter,
  onApply,
  onReset,
}: FilterSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-background border-border fixed top-0 right-0 z-50 h-full w-80 border-l shadow-2xl"
          >
            <FilterSidebarContent
              onClose={onClose}
              typeFilter={typeFilter}
              onApply={onApply}
              onReset={onReset}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterSidebarContent({
  onClose,
  typeFilter,
  onApply,
  onReset,
}: Omit<FilterSidebarProps, 'isOpen'>) {
  const [localTypeFilter, setLocalTypeFilter] = useState<BenefitType | 'all'>(
    typeFilter,
  );

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
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b p-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Filter className="text-primary h-4 w-4" />
          </div>
          <h2 className="text-foreground font-serif text-lg font-bold">
            Filter
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Tipe Benefit
            </label>
            <div className="flex flex-col gap-2">
              {filterOptions.map((opt) => (
                <button
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-border border-t p-6">
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground w-full"
          >
            Reset Filter
          </Button>
          <Button
            onClick={handleApply}
            className="bg-primary hover:bg-primary-dark w-full"
          >
            Tampilkan Hasil
          </Button>
        </div>
      </div>
    </div>
  );
}
