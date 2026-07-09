'use client';

import SharedFilterSidebar from '@/components/shared/filter-sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { USER_STATUS_OPTIONS } from '@/constants/user.constant';
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
  const packages = packagesData?.data || [];

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
      label: USER_STATUS_OPTIONS.ACTIVE.LABEL,
      value: USER_STATUS_OPTIONS.ACTIVE.VALUE,
    },
    {
      label: USER_STATUS_OPTIONS.INACTIVE.LABEL,
      value: USER_STATUS_OPTIONS.INACTIVE.VALUE,
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
          <Select
            value={localStatus || ''}
            onValueChange={(val) => setLocalStatus(val || undefined)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Status Akun" />
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
            Pilih Paket
          </label>
          {isLoadingPackages ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            </div>
          ) : (
            <Select
              value={localPackageId ? String(localPackageId) : ''}
              onValueChange={(val) =>
                setLocalPackageId(val ? Number(val) : undefined)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Paket Member" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem
                    key={pkg.id}
                    value={String(pkg.id)}
                    className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                  >
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </SharedFilterSidebar>
  );
}
