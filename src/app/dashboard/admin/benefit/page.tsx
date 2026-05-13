'use client';

import CreateBenefitModal from '@/components/dashboard/admin/create-benefit-modal';
import EditBenefitModal from '@/components/dashboard/admin/edit-benefit-modal';
import DeleteModal from '@/components/shared/delete-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDeleteBenefit, useGetBenefits } from '@/hooks/api/use-benefit';
import { useToast } from '@/hooks/use-toast';
import { isAxiosError } from 'axios';
import {
  Filter,
  Heart,
  Loader2,
  Plus,
  Search,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import FilterBenefitSidebar from '@/components/dashboard/admin/filter-benefit-sidebar';
import Pagination from '@/components/shared/pagination';
import { formatDate } from '@/lib/date';
import { TBenefit, TBenefitType } from '@/types/benefit.type';
import { ModalType } from '@/types/modal.type';
import { useDebouncedCallback } from 'use-debounce';

export default function BenefitManagementPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<TBenefit | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    type: undefined as TBenefitType | undefined,
    page: 1,
    limit: 10,
  });

  const { toast } = useToast();

  const { data: benefitsData, isLoading } = useGetBenefits({
    search: filters.search,
    type: filters.type,
    page: filters.page,
    limit: filters.limit,
  });

  const { mutate: deleteBenefit, isPending: isDeleting } = useDeleteBenefit();

  const benefits = benefitsData?.items || [];
  const totalItems = benefitsData?.total || 0;
  const totalPages = Math.ceil(totalItems / filters.limit);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedBenefit(null);
  };

  const handleOpenModal = (type: ModalType, benefit?: TBenefit) => {
    if (benefit) setSelectedBenefit(benefit);
    setActiveModal(type);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  }, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleApplyFilter = (newFilters: { type?: TBenefitType }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({
      search: '',
      type: undefined,
      page: 1,
      limit: 10,
    });
    setSearchTerm('');
  };

  const handleDelete = () => {
    if (!selectedBenefit) return;
    deleteBenefit(selectedBenefit.id, {
      onSuccess: () => {
        toast({
          title: 'Benefit dihapus',
          description: 'Benefit telah berhasil dihapus dari sistem.',
        });
        closeModal();
      },
      onError: (error) => {
        let message = 'Gagal menghapus member.';
        if (isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }
        toast({
          variant: 'destructive',
          title: 'Gagal menghapus member',
          description: message,
        });
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Daftar Benefit
          </h1>
          <p className="text-muted-foreground text-sm">
            Daftarkan fitur-fitur yang tersedia untuk dipasang pada paket
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
          onClick={() => handleOpenModal('create')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Benefit
        </Button>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari nama atau key benefit..."
                value={searchTerm}
                onChange={onSearchChange}
                className="border-border focus:ring-primary h-10 bg-transparent pl-9 text-sm focus:ring-1"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground h-10 px-4 transition-all"
              onClick={() => setIsFilterSidebarOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {filters.type && (
                <span className="bg-primary ml-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm">
                  {[filters.type].filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-secondary/30 text-muted-foreground border-border border-b text-[11px] font-bold tracking-wider uppercase">
                <th className="px-6 py-4 font-semibold">Benefit & Key</th>
                <th className="hidden px-6 py-4 font-semibold md:table-cell">
                  Deskripsi
                </th>
                <th className="px-6 py-4 font-semibold">Tanggal Dibuat</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Memuat data benefit...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : benefits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="text-primary fill-primary h-8 w-8" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Tidak ada benefit ditemukan.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                benefits.map((benefit) => (
                  <tr
                    key={benefit.id}
                    className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-foreground font-bold">
                            {benefit.name}
                          </span>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-muted-foreground font-mono text-[10px] tracking-tighter">
                              Key : {benefit.key}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-5 md:table-cell">
                      <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
                        {benefit.description}
                      </p>
                    </td>
                    <td className="text-muted-foreground px-6 py-5 text-xs">
                      {formatDate(benefit.createdAt)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                              onClick={() => {
                                handleOpenModal('edit', benefit);
                              }}
                            >
                              <SquarePen className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-secondary h-8 w-8 transition-colors"
                              onClick={() => {
                                handleOpenModal('delete', benefit);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hapus</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={filters.page}
          totalPages={totalPages}
          limit={filters.limit}
          totalItems={totalItems}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) =>
            setFilters((prev) => ({ ...prev, limit, page: 1 }))
          }
          isLoading={isLoading}
        />
      </div>

      <CreateBenefitModal
        isOpen={activeModal === 'create'}
        onClose={closeModal}
      />

      {selectedBenefit && (
        <EditBenefitModal
          isOpen={activeModal === 'edit'}
          onClose={closeModal}
          benefit={selectedBenefit}
        />
      )}

      <DeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={`Hapus Benefit ${selectedBenefit?.name}?`}
      />

      <FilterBenefitSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        typeFilter={filters.type}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
