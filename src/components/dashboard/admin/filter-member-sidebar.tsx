'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import { Button } from '@/components/ui/button';
import { USER_STATUS_ENUM } from '@/db/schema';
import { useGetPackages } from '@/hooks/api/use-package';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface FilterMemberSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  packageIdFilter?: number;
  statusFilter?: string;
  onApply: (filters: { packageId?: number; status?: string }) => void;
  onReset: () => void;
}

export default function FilterMemberSidebar({
  isOpen,
  onClose,
  packageIdFilter,
  statusFilter,
  onApply,
  onReset,
}: FilterMemberSidebarProps) {
  const [localPackageId, setLocalPackageId] = useState<number | undefined>(
    packageIdFilter,
  );
  const [localStatus, setLocalStatus] = useState<string | undefined>(
    statusFilter,
  );

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const { data: packagesData, isLoading: isLoadingPackages } = useGetPackages({
    limit: 100,
  });
  const packages = packagesData?.items || [];

  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setLocalPackageId(packageIdFilter);
    setLocalStatus(statusFilter);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleApply = () => {
    onApply({
      packageId: localPackageId,
      status: localStatus,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalPackageId(undefined);
    setLocalStatus(undefined);
    onReset();
  };

  const statusOptions = [
    {
      label: USER_STATUS_ENUM.ACTIVE.LABEL,
      value: USER_STATUS_ENUM.ACTIVE.VALUE,
    },
    {
      label: USER_STATUS_ENUM.INACTIVE.LABEL,
      value: USER_STATUS_ENUM.INACTIVE.VALUE,
    },
  ];

  return (
    <SharedFilterSidebar
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      onReset={handleReset}
      title="Filter Member"
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Status Akun
          </label>
          <div className="flex flex-col gap-2">
            {statusOptions.map((opt) => (
              <Button
                key={opt.value}
                onClick={() =>
                  setLocalStatus(
                    localStatus === opt.value ? undefined : opt.value,
                  )
                }
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                  localStatus === opt.value
                    ? 'bg-primary/5 text-primary border-primary/30 ring-primary/30 hover:bg-primary/10 border ring-1'
                    : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 border border-transparent'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {localStatus === opt.value && (
                  <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Pilih Paket
          </label>
          {isLoadingPackages ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {packages.map((pkg) => (
                <Button
                  key={pkg.id}
                  onClick={() =>
                    setLocalPackageId(
                      localPackageId === pkg.id ? undefined : pkg.id,
                    )
                  }
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                    localPackageId === pkg.id
                      ? 'bg-primary/5 text-primary border-primary/30 ring-primary/30 hover:bg-primary/10 border ring-1'
                      : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 border border-transparent'
                  }`}
                >
                  <span className="font-medium">{pkg.name}</span>
                  {localPackageId === pkg.id && (
                    <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </SharedFilterSidebar>
  );
}
