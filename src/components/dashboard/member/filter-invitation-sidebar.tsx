'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvitationStatusEnum } from '@/enums/invitation.enum';
import { useState } from 'react';

interface FilterInvitationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter?: InvitationStatusEnum;
  onApply: (filters: { status?: InvitationStatusEnum }) => void;
  onReset: () => void;
}

export default function FilterInvitationSidebar({
  isOpen,
  onClose,
  statusFilter,
  onApply,
  onReset,
}: FilterInvitationSidebarProps) {
  const [localStatus, setLocalStatus] = useState<
    InvitationStatusEnum | undefined
  >(statusFilter);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalStatus(statusFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply({
      status: localStatus,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalStatus(undefined);
    onReset();
  };

  const statusOptions = [
    {
      label: 'Draft',
      value: InvitationStatusEnum.Draft,
    },
    {
      label: 'Published',
      value: InvitationStatusEnum.Published,
    },
    {
      label: 'Expired',
      value: InvitationStatusEnum.Expired,
    },
  ];

  return (
    <SharedFilterSidebar
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Undangan"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Status Undangan
          </label>
          <div className="flex flex-col gap-2">
            <Select
              value={localStatus || ''}
              onValueChange={(val) =>
                setLocalStatus(val as InvitationStatusEnum)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Status Undangan" />
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
        </div>
      </div>
    </SharedFilterSidebar>
  );
}
