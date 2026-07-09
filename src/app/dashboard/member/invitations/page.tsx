'use client';

import FilterInvitationSidebar from '@/components/dashboard/member/filter-invitation-sidebar';
import DeleteModal from '@/components/shared/delete-modal';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InvitationStatusEnum } from '@/enums/invitation.enum';
import {
  useDeleteInvitation,
  useGetInvitations,
} from '@/hooks/api/use-invitation';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/date';
import { ModalType } from '@/types/modal.type';
import { isAxiosError } from 'axios';
import {
  Eye,
  Filter,
  Heart,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  SquarePen,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type InvitationItem = {
  id: number;
  slug: string;
  status: string;
  groomName: string;
  brideName: string;
  events: Array<{
    date: string | Date | null;
    time: string | null;
  }>;
  templateName: string;
  createdAt: string | Date;
  publishedAt?: string | Date | null;
  expiredText: string;
  totalViews: number;
  totalRsvps: number;
};

export default function MemberInvitationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: undefined as InvitationStatusEnum | undefined,
    page: 1,
    limit: 10,
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedInvitation, setSelectedInvitation] =
    useState<InvitationItem | null>(null);

  const { data: invitationsData, isLoading } = useGetInvitations({
    search: filters.search,
    status: filters.status,
    page: filters.page,
    limit: filters.limit,
  });

  const { mutate: deleteInvitation, isPending: isPendingDelete } =
    useDeleteInvitation();

  const { toast } = useToast();

  const handleDelete = () => {
    if (!selectedInvitation) return;
    deleteInvitation(selectedInvitation.id, {
      onSuccess: () => {
        toast({
          title: 'Undangan dihapus',
          description: 'Undangan berhasil dihapus.',
        });
        closeModal();
      },
      onError: (error) => {
        let message = 'Gagal menghapus undangan.';
        if (isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }
        toast({
          variant: 'destructive',
          title: 'Gagal menghapus undangan',
          description: message,
        });
      },
    });
  };
  const invitations = invitationsData?.data || [];
  const totalItems = invitationsData?.meta?.total || 0;
  const totalPages = invitationsData?.meta?.totalPages || 1;

  const handleSearch = useDebouncedCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  }, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleApplyFilter = (newFilters: {
    status?: InvitationStatusEnum | undefined;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({
      search: '',
      status: undefined,
      page: 1,
      limit: 10,
    });
    setSearchTerm('');
  };

  const handleOpenModal = (type: ModalType, invitation?: InvitationItem) => {
    if (invitation) setSelectedInvitation(invitation);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedInvitation(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Undangan
          </h1>
          <p className="text-muted-foreground text-sm">
            Total {totalItems} undangan terdaftar
          </p>
        </div>
        <Link href={'/dashboard/member/invitations/create'}>
          <Button className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Undangan
          </Button>
        </Link>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari undangan..."
                value={searchTerm}
                onChange={onSearchChange}
                className="border-border focus:ring-primary h-10 bg-transparent pl-9 text-sm focus:ring-1"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark h-10 cursor-pointer px-4 transition-colors"
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
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tanggal Event</th>
                <th className="px-6 py-4 font-semibold">Total View</th>
                <th className="px-6 py-4 font-semibold">Total RSVP</th>
                <th className="px-6 py-4 font-semibold">Link Kadaluarsa</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Memuat data undangan...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : invitations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="text-primary fill-primary h-8 w-8" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Tidak ada data undangan.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                invitations.map((invitation: InvitationItem) => (
                  <tr
                    key={invitation.id}
                    className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold">
                      <Link
                        href={`/invite/${invitation.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary font-semibold transition-colors hover:underline"
                      >
                        {invitation.groomName} & {invitation.brideName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          invitation.status === 'published'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {invitation.status === 'published'
                          ? 'Published'
                          : invitation.status === 'draft'
                            ? 'Draft'
                            : 'Expired'}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {invitation.events.length > 0 && invitation.events[0].date
                        ? formatDate(invitation.events[0].date)
                        : '-'}
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {invitation.totalViews} Kunjungan
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {invitation.totalRsvps} Konfirmasi
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {invitation.publishedAt ? (
                        <TooltipProvider>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dashed underline-offset-4">
                                {invitation.expiredText}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Masa aktif dihitung sejak dipublikasikan pada{' '}
                                {formatDate(invitation.publishedAt)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        invitation.expiredText
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-36 p-1">
                            <div className="flex flex-col gap-0.5">
                              <Link
                                href={`/invitation/index-preview?id=${invitation.id}&to=Tamu+Spesial`}
                                passHref
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary-dark hover:text-primary-dark hover:bg-primary/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Preview
                                </Button>
                              </Link>
                              <Link
                                href={`/dashboard/member/invitations/edit/${invitation.id}`}
                                passHref
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary-dark hover:text-primary-dark hover:bg-primary/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                                >
                                  <SquarePen className="h-3.5 w-3.5" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                                onClick={() =>
                                  handleOpenModal('delete', invitation)
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
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

      <DeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        isLoading={isPendingDelete}
        title={`Hapus Undangan ${selectedInvitation?.groomName} & ${selectedInvitation?.brideName}?`}
      />

      <FilterInvitationSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        statusFilter={filters.status}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
