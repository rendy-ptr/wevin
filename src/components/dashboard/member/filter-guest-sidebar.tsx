'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { useGetInvitationOptions } from '@/hooks/api/use-invitation';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface FilterGuestSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter?: GuestStatusEnum;
  invitationIdFilter?: number;
  onApply: (filters: {
    status?: GuestStatusEnum;
    invitationId?: number;
  }) => void;
  onReset: () => void;
}

export default function FilterGuestSidebar({
  isOpen,
  onClose,
  statusFilter,
  invitationIdFilter,
  onApply,
  onReset,
}: FilterGuestSidebarProps) {
  const [localStatus, setLocalStatus] = useState<GuestStatusEnum | undefined>(
    statusFilter,
  );
  const [localInvitationId, setLocalInvitationId] = useState<
    number | undefined
  >(invitationIdFilter);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const { data: invitationsData, isLoading: isLoadingInvitations } =
    useGetInvitationOptions();
  const invitations = invitationsData || [];

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalStatus(statusFilter);
    setLocalInvitationId(invitationIdFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply({
      status: localStatus,
      invitationId: localInvitationId,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalStatus(undefined);
    setLocalInvitationId(undefined);
    onReset();
  };

  const statusOptions = [
    { label: 'Belum Dikirim (Idle)', value: GuestStatusEnum.Idle },
    { label: 'Dibuka (Opened)', value: GuestStatusEnum.Opened },
    { label: 'Merespon (Responded)', value: GuestStatusEnum.Responded },
  ];

  return (
    <SharedFilterSidebar
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Buku Tamu"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Status Undangan Tamu
          </label>
          <Select
            value={localStatus || ''}
            onValueChange={(val) => setLocalStatus(val as GuestStatusEnum)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua Status" />
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
            Undangan
          </label>
          {isLoadingInvitations ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            </div>
          ) : (
            <Select
              value={localInvitationId ? String(localInvitationId) : ''}
              onValueChange={(val) => setLocalInvitationId(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    invitations.length === 0
                      ? 'Belum ada undangan'
                      : 'Semua Undangan'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {invitations.length === 0 ? (
                  <SelectItem
                    value="0"
                    disabled
                    className="text-muted-foreground text-xs"
                  >
                    Belum ada undangan
                  </SelectItem>
                ) : (
                  invitations.map(
                    (inv: {
                      id: number;
                      groomName: string;
                      brideName: string;
                    }) => (
                      <SelectItem
                        key={inv.id}
                        value={String(inv.id)}
                        className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                      >
                        {inv.groomName} & {inv.brideName}
                      </SelectItem>
                    ),
                  )
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </SharedFilterSidebar>
  );
}
