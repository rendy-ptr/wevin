'use client';

import FilterSidebar from '@/components/dashboard/admin/filter-package-sidebar';
import DeleteModal from '@/components/shared/delete-modal';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PACKAGE_STATUS, TPackageStatus } from '@/db/schema';
import { useDeletePackage, useGetPackages } from '@/hooks/api/use-package';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';
import { Package } from '@/types/package.type';
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
import Link from 'next/link';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function PackageManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TPackageStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [prevSearch, setPrevSearch] = useState(debouncedSearchTerm);
  const [prevStatus, setPrevStatus] = useState(statusFilter);

  if (prevSearch !== debouncedSearchTerm || prevStatus !== statusFilter) {
    setPrevSearch(debouncedSearchTerm);
    setPrevStatus(statusFilter);
    setPage(1);
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const { toast } = useToast();

  const { data: packagesData, isLoading } = useGetPackages({
    search: debouncedSearchTerm,
    status: statusFilter,
    page,
    limit,
  });

  const packages = packagesData?.items || [];
  const totalItems = packagesData?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const deleteMutation = useDeletePackage();

  const handleDelete = () => {
    if (selectedPackage) {
      deleteMutation.mutate(selectedPackage.id, {
        onSuccess: () => {
          toast({
            title: 'Paket dihapus',
            description: 'Paket telah berhasil dihapus dari sistem.',
          });
          setIsDeleteModalOpen(false);
          setSelectedPackage(null);
        },
        onError: (error) => {
          let message = 'Gagal menghapus paket.';
          if (isAxiosError(error)) {
            message = error.response?.data?.message || message;
          }
          toast({
            variant: 'destructive',
            title: 'Gagal menghapus paket',
            description: message,
          });
        },
      });
    }
  };

  const handleResetFilter = () => {
    setStatusFilter(undefined);
    setSearchTerm('');
  };

  const activeFilterCount = [statusFilter !== undefined].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Daftar Paket
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola paket undangan dan harga yang tersedia
          </p>
        </div>
        <Link href="/dashboard/admin/package/create">
          <Button className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Paket
          </Button>
        </Link>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari nama paket..."
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
                <th className="px-6 py-4 font-semibold">Paket</th>
                <th className="px-6 py-4 font-semibold">Harga</th>
                <th className="px-6 py-4 font-semibold">Status</th>
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
                        Memuat data paket...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="text-primary fill-primary h-8 w-8" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Tidak ada paket ditemukan.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-foreground font-bold">
                          {pkg.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {pkg.description || 'Tidak ada deskripsi'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-foreground font-semibold">
                        {formatCurrency(pkg.price)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {pkg.status === PACKAGE_STATUS.ACTIVE ? (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-destructive/10 text-destructive rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                          Non-aktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/dashboard/admin/package/${pkg.id}/edit`}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                              >
                                <SquarePen className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-secondary h-8 w-8 transition-colors"
                              onClick={() => {
                                setSelectedPackage(pkg);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Hapus</TooltipContent>
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
          page={page}
          totalPages={totalPages}
          limit={limit}
          totalItems={totalItems}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          isLoading={isLoading}
        />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title={`Hapus Paket ${selectedPackage?.name}?`}
      />

      <FilterSidebar
        isOpen={isFilterMenuOpen}
        onClose={() => setIsFilterMenuOpen(false)}
        statusFilter={statusFilter}
        onApply={setStatusFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
