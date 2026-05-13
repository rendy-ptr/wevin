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
import { USER_STATUS, USER_STATUS_OPTIONS } from '@/constants/user.constant';
import {
  useDeleteMember,
  useGetMembers,
  useUpdateMemberStatus,
} from '@/hooks/api/use-member';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/date';
import { UserMember } from '@/types/member.type';
import { ModalType } from '@/types/modal.type';
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
import { useDebouncedCallback } from 'use-debounce';

export default function MemberManagementPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedMember, setSelectedMember] = useState<UserMember | null>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    packageId: undefined as number | undefined,
    status: undefined as string | undefined,
    page: 1,
    limit: 10,
  });

  const { toast } = useToast();

  const { data: membersData, isLoading } = useGetMembers({
    search: filters.search,
    packageId: filters.packageId,
    status: filters.status,
    page: filters.page,
    limit: filters.limit,
  });

  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: updateStatus, isPending: isStatusUpdating } =
    useUpdateMemberStatus();

  const members = membersData?.items || [];
  const totalItems = membersData?.total || 0;
  const totalPages = Math.ceil(totalItems / filters.limit);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedMember(null);
  };

  const handleOpenModal = (type: ModalType, member?: UserMember) => {
    if (member) setSelectedMember(member);
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

  const handleApplyFilter = (newFilters: {
    packageId?: number;
    status?: string;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({
      search: '',
      packageId: undefined,
      status: undefined,
      page: 1,
      limit: 10,
    });
    setSearchTerm('');
  };

  const handleDelete = () => {
    if (!selectedMember) return;
    deleteMember(selectedMember.id, {
      onSuccess: () => {
        toast({
          title: 'Member dihapus',
          description: 'Member telah berhasil dihapus dari sistem.',
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

  const handleUpdateStatus = () => {
    if (!selectedMember) return;
    const newStatus =
      selectedMember.status === USER_STATUS.ACTIVE
        ? USER_STATUS.INACTIVE
        : USER_STATUS.ACTIVE;

    updateStatus(
      { id: selectedMember.id, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: 'Status diperbarui',
            description: `Member telah berhasil ${
              newStatus === USER_STATUS.INACTIVE
                ? 'di Non-Aktifkan'
                : 'di Aktifkan'
            }`,
          });
          closeModal();
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
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Member
          </h1>
          <p className="text-muted-foreground text-sm">
            Total {totalItems} akun terdaftar
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
          onClick={() => handleOpenModal('create')}
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
                        Tidak ada data member.
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
                    <td className="px-6 py-4 font-semibold">{member.name}</td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {member.email}
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {member.profile?.package?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          member.status === USER_STATUS.ACTIVE
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {member.status === USER_STATUS.ACTIVE
                          ? USER_STATUS_OPTIONS.ACTIVE.LABEL
                          : USER_STATUS_OPTIONS.INACTIVE.LABEL}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                              onClick={() => handleOpenModal('edit', member)}
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
                                member.status === USER_STATUS.ACTIVE
                                  ? 'text-accent hover:text-accent hover:bg-secondary'
                                  : 'text-success hover:text-success hover:bg-secondary'
                              }`}
                              onClick={() => handleOpenModal('status', member)}
                            >
                              {member.status === USER_STATUS.ACTIVE ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {member.status === USER_STATUS.ACTIVE
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
                              onClick={() => handleOpenModal('delete', member)}
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
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          onLimitChange={(l) =>
            setFilters((f) => ({ ...f, limit: l, page: 1 }))
          }
          isLoading={isLoading}
        />
      </div>

      <CreateMemberModal
        isOpen={activeModal === 'create'}
        onClose={closeModal}
      />

      {selectedMember && (
        <EditMemberModal
          isOpen={activeModal === 'edit'}
          onClose={closeModal}
          member={selectedMember}
        />
      )}

      <DeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={`Hapus Member ${selectedMember?.name}?`}
      />

      <DeactiveModal
        isOpen={activeModal === 'status'}
        onClose={closeModal}
        onConfirm={handleUpdateStatus}
        isLoading={isStatusUpdating}
        member={selectedMember}
      />

      <FilterMemberSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        packageIdFilter={filters.packageId}
        statusFilter={filters.status}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
