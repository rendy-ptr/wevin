'use client';

import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { ReactNode } from 'react';
import SlideOver from './slide-over';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  children: ReactNode;
  title?: string;
  width?: string;
}

export default function SharedFilterSidebar({
  isOpen,
  onClose,
  onApply,
  onReset,
  children,
  title = 'Filter',
  width = 'w-80',
}: FilterSidebarProps) {
  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={width}
      icon={<Filter className="text-primary h-4 w-4" />}
      footer={
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground w-full"
          >
            Reset Filter
          </Button>
          <Button
            onClick={onApply}
            className="bg-primary hover:bg-primary-dark w-full"
          >
            Tampilkan Hasil
          </Button>
        </div>
      }
    >
      {children}
    </SlideOver>
  );
}
