'use client';

import CreateMemberModal from '@/components/dashboard/admin/create-member-modal';
import EditMemberModal from '@/components/dashboard/admin/edit-member-modal';
import FilterMemberSidebar from '@/components/dashboard/admin/filter-member-sidebar';
import DeactiveModal from '@/components/shared/deactive-modal';
import DeleteModal from '@/components/shared/delete-modal';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { USER_STATUS_ENUM } from '@/db/schema';
import {
  useDeleteMember,
  useGetMembers,
  useUpdateMemberStatus,
} from '@/hooks/api/use-member';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/date';
import { UserMember } from '@/types/member.type';
import { isAxiosError } from 'axios';
import {
  Filter,
  Heart,
  Loader2,
  Plus,
  Search,
  SquarePen,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function MemberManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UserMember | null>(null);
  const [packageIdFilter, setPackageIdFilter] = useState<number | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [prevSearch, setPrevSearch] = useState(debouncedSearchTerm);
  const [prevPackageId, setPrevPackageId] = useState(packageIdFilter);
  const [prevStatus, setPrevStatus] = useState(statusFilter);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const { toast } = useToast();

  const { data: membersData, isLoading } = useGetMembers({
    search: debouncedSearchTerm,
    packageId: packageIdFilter,
    status: statusFilter,
    page,
    limit,
  });

  const members = membersData?.items || [];
  const totalItems = membersData?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const { mutate, isPending } = useDeleteMember();
  const { mutate: updateStatus, isPending: isStatusPending } =
    useUpdateMemberStatus();

  const handleDelete = () => {
    if (selectedMember) {
      mutate(selectedMember.id, {
        onSuccess: () => {
          toast({
            title: 'Member dihapus',
            description: 'Member telah berhasil dihapus dari sistem.',
          });
          setIsDeleteModalOpen(false);
          setSelectedMember(null);
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
    }
  };

  const handleUpdateStatus = () => {
    if (selectedMember) {
      const newStatus =
        selectedMember.status === USER_STATUS_ENUM.ACTIVE.VALUE
          ? USER_STATUS_ENUM.INACTIVE.VALUE
          : USER_STATUS_ENUM.ACTIVE.VALUE;
      updateStatus(
        { id: selectedMember.id, status: newStatus },
        {
          onSuccess: () => {
            toast({
              title: 'Status diperbarui',
              description: `Member telah berhasil ${
                newStatus === USER_STATUS_ENUM.INACTIVE.VALUE
                  ? 'di Non-Aktifkan'
                  : 'di Aktifkan'
              }`,
            });
            setIsStatusModalOpen(false);
            setSelectedMember(null);
          },
          onError: (error) => {
            let message = 'Gagal mengubah status member.';
            if (isAxiosError(error)) {
              message = error.response?.data?.message || message;
            }
            toast({
              variant: 'destructive',
              title: 'Gagal mengubah status member',
              description: message,
            });
          },
        },
      );
    }
  };

  if (
    prevSearch !== debouncedSearchTerm ||
    prevPackageId !== packageIdFilter ||
    prevStatus !== statusFilter
  ) {
    setPrevSearch(debouncedSearchTerm);
    setPrevPackageId(packageIdFilter);
    setPrevStatus(statusFilter);
    setPage(1);
  }

  const handleApplyFilter = ({
    packageId,
    status,
  }: {
    packageId?: number;
    status?: string;
  }) => {
    setPackageIdFilter(packageId);
    setStatusFilter(status);
    setPage(1);
  };

  const handleResetFilter = () => {
    setPackageIdFilter(undefined);
    setStatusFilter(undefined);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Member
          </h1>
          <p className="text-muted-foreground text-sm">
            Total {members.length} akun terdaftar
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Member
        </Button>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-border focus:ring-primary h-10 bg-transparent pl-9 text-sm focus:ring-1"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground h-10 px-4 transition-all"
              onClick={() => setIsFilterMenuOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-secondary/30 text-muted-foreground border-border border-b text-[11px] font-bold tracking-wider uppercase">
                <th className="px-6 py-4 font-semibold">Nama</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Paket</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tanggal Dibuat</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Memuat data member...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="text-primary fill-primary h-8 w-8" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Tidak ada paket ditemukan.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-foreground font-semibold">
                        {member.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground text-xs">
                        {member.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground text-xs">
                        {member.profile?.package?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          member.status === USER_STATUS_ENUM.ACTIVE.VALUE
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {member.status === USER_STATUS_ENUM.ACTIVE.VALUE
                          ? USER_STATUS_ENUM.ACTIVE.LABEL
                          : USER_STATUS_ENUM.INACTIVE.LABEL}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground text-xs">
                        {formatDate(member.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                              onClick={() => {
                                setSelectedMember(member);
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
                              className={`hover:bg-secondary h-8 w-8 transition-colors ${
                                member.status === USER_STATUS_ENUM.ACTIVE.VALUE
                                  ? 'text-accent hover:text-accent hover:bg-secondary'
                                  : 'text-success hover:text-success hover:bg-secondary'
                              }`}
                              onClick={() => {
                                setSelectedMember(member);
                                setIsStatusModalOpen(true);
                              }}
                            >
                              {member.status ===
                              USER_STATUS_ENUM.ACTIVE.VALUE ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {member.status === USER_STATUS_ENUM.ACTIVE.VALUE
                                ? 'Non-Aktifkan'
                                : 'Aktifkan'}
                            </p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-secondary h-8 w-8 transition-colors"
                              onClick={() => {
                                setSelectedMember(member);
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

      <CreateMemberModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedMember && (
        <EditMemberModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          member={selectedMember}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title={`Hapus Member ${selectedMember?.name}?`}
      />

      <DeactiveModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleUpdateStatus}
        isLoading={isStatusPending}
        member={selectedMember}
      />

      <FilterMemberSidebar
        isOpen={isFilterMenuOpen}
        onClose={() => setIsFilterMenuOpen(false)}
        packageIdFilter={packageIdFilter}
        statusFilter={statusFilter}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
