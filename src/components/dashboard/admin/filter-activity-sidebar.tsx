'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ACTIVITY_ACTION_OPTIONS } from '@/constants/activity.constant';
import { cn } from '@/lib/utils';
import { endOfDay, format, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface FilterActivitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  startDateFilter?: Date;
  endDateFilter?: Date;
  actionFilter?: string;
  onApply: (filters: {
    startDate?: Date;
    endDate?: Date;
    action?: string;
  }) => void;
  onReset: () => void;
}

export default function FilterActivitySidebar({
  isOpen,
  onClose,
  startDateFilter,
  endDateFilter,
  actionFilter,
  onApply,
  onReset,
}: FilterActivitySidebarProps) {
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    startDateFilter,
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(
    endDateFilter,
  );
  const [localAction, setLocalAction] = useState<string | undefined>(
    actionFilter,
  );

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalStartDate(startDateFilter);
    setLocalEndDate(endDateFilter);
    setLocalAction(actionFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply({
      startDate: localStartDate ? startOfDay(localStartDate) : undefined,
      endDate: localEndDate ? endOfDay(localEndDate) : undefined,
      action: localAction,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalStartDate(undefined);
    setLocalEndDate(undefined);
    setLocalAction(undefined);
    onReset();
  };

  const actionOptions = Object.values(ACTIVITY_ACTION_OPTIONS).map((opt) => ({
    value: opt.VALUE,
    label: opt.LABEL,
  }));

  return (
    <SharedFilterSidebar
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Logs"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Tanggal
          </label>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs">
                Mulai Dari
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark w-full cursor-pointer justify-start text-left text-sm font-normal transition-colors',
                      !localStartDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localStartDate ? (
                      format(localStartDate, 'PPP', { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localStartDate}
                    onSelect={setLocalStartDate}
                    classNames={{
                      day_button:
                        'hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark data-[selected-single=true]:bg-primary-dark data-[selected-single=true]:text-white transition-colors rounded-md',
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs">
                Sampai Dengan
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark w-full cursor-pointer justify-start text-left text-sm font-normal transition-colors',
                      !localEndDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localEndDate ? (
                      format(localEndDate, 'PPP', { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localEndDate}
                    onSelect={setLocalEndDate}
                    classNames={{
                      day_button:
                        'hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark data-[selected-single=true]:bg-primary-dark data-[selected-single=true]:text-white transition-colors rounded-md',
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Aksi
          </label>
          <div className="flex flex-col gap-2">
            <Select
              value={localAction || ''}
              onValueChange={(val) => setLocalAction(val || undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Aksi" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((opt) => (
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
      </div>
    </SharedFilterSidebar>
  );
}
