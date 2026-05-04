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
import { Benefit } from '@/types/benefit/type';
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

import FilterSidebar from '@/components/dashboard/admin/filter-benefit-sidebar';
import { BenefitType } from '@/constants/benefits';
import { useDebounce } from 'use-debounce';

export default function BenefitManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<BenefitType | 'all'>('all');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

  const { toast } = useToast();

  const { data: benefits = [], isLoading } = useGetBenefits(
    debouncedSearchTerm,
    typeFilter === 'all' ? undefined : typeFilter,
  );

  const deleteMutation = useDeleteBenefit();

  const handleDelete = () => {
    if (selectedBenefit) {
      deleteMutation.mutate(selectedBenefit.id, {
        onSuccess: () => {
          toast({
            title: 'Benefit dihapus',
            description: 'Benefit telah berhasil dihapus dari sistem.',
          });
          setIsDeleteModalOpen(false);
          setSelectedBenefit(null);
        },
        onError: (error) => {
          let message = 'Gagal menghapus benefit.';
          if (isAxiosError(error)) {
            message = error.response?.data?.message || message;
          }
          toast({
            variant: 'destructive',
            title: 'Gagal menghapus benefit',
            description: message,
          });
        },
      });
    }
  };

  const handleResetFilter = () => {
    setTypeFilter('all');
    setSearchTerm('');
  };

  const activeFilterCount = [typeFilter !== 'all'].filter(Boolean).length;

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
          onClick={() => setIsCreateModalOpen(true)}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-border focus:ring-primary h-10 bg-transparent pl-9 text-sm focus:ring-1"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className={`border-border h-10 px-4 transition-all ${isFilterMenuOpen ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              onClick={() => setIsFilterMenuOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-primary ml-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white">
                  {activeFilterCount}
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
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
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
                  <td colSpan={3} className="px-6 py-20 text-center">
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
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                              onClick={() => {
                                setSelectedBenefit(benefit);
                                setIsEditModalOpen(true);
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
                                setSelectedBenefit(benefit);
                                setIsDeleteModalOpen(true);
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
      </div>

      <CreateBenefitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedBenefit && (
        <EditBenefitModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          benefit={selectedBenefit}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title={`Hapus Benefit ${selectedBenefit?.name}?`}
      />

      <FilterSidebar
        isOpen={isFilterMenuOpen}
        onClose={() => setIsFilterMenuOpen(false)}
        typeFilter={typeFilter}
        onApply={setTypeFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
