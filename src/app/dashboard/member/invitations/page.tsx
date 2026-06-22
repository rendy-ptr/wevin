'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDate } from '@/lib/date';
import {
  Filter,
  Heart,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Share,
  SquarePen,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

export default function MemberInvitationsPage() {
  //   const [activeModal, setActiveModal] = useState<ModalType>(null);
  //   const [selectedMember, setSelectedMember] =
  //     useState<UserWithRelationships | null>(null);
  //   const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  //   const [searchTerm, setSearchTerm] = useState('');

  //   const [filters, setFilters] = useState({
  //     search: '',
  //     packageId: undefined as number | undefined,
  //     status: undefined as string | undefined,
  //     page: 1,
  //     limit: 10,
  //   });

  //   const { toast } = useToast();

  //   const { data: membersData, isLoading } = useGetMembers({
  //     search: filters.search,
  //     packageId: filters.packageId,
  //     status: filters.status,
  //     page: filters.page,
  //     limit: filters.limit,
  //   });

  //   const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  //   const { mutate: updateStatus, isPending: isStatusUpdating } =
  //     useUpdateMemberStatus();

  //   const members = membersData?.items || [];
  //   const totalItems = membersData?.total || 0;
  //   const totalPages = Math.ceil(totalItems / filters.limit);

  //   const closeModal = () => {
  //     setActiveModal(null);
  //     setSelectedMember(null);
  //   };

  //   const handleOpenModal = (type: ModalType, member?: UserWithRelationships) => {
  //     if (member) setSelectedMember(member);
  //     setActiveModal(type);
  //   };

  //   const handleSearch = useDebouncedCallback((value: string) => {
  //     setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  //   }, 500);

  //   const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     setSearchTerm(value);
  //     handleSearch(value);
  //   };

  //   const handleApplyFilter = (newFilters: {
  //     packageId?: number;
  //     status?: string;
  //   }) => {
  //     setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  //   };

  //   const handleResetFilter = () => {
  //     setFilters({
  //       search: '',
  //       packageId: undefined,
  //       status: undefined,
  //       page: 1,
  //       limit: 10,
  //     });
  //     setSearchTerm('');
  //   };

  //   const handleDelete = () => {
  //     if (!selectedMember) return;
  //     deleteMember(selectedMember.id, {
  //       onSuccess: () => {
  //         toast({
  //           title: 'Member dihapus',
  //           description: 'Member telah berhasil dihapus dari sistem.',
  //         });
  //         closeModal();
  //       },
  //       onError: (error) => {
  //         let message = 'Gagal menghapus member.';
  //         if (isAxiosError(error)) {
  //           message = error.response?.data?.message || message;
  //         }
  //         toast({
  //           variant: 'destructive',
  //           title: 'Gagal menghapus member',
  //           description: message,
  //         });
  //       },
  //     });
  //   };

  //   const handleUpdateStatus = (data: UpdateMemberStatusFormValues) => {
  //     if (!selectedMember) return;
  //     const newStatus = data.status;

  //     updateStatus(
  //       { id: selectedMember.id, status: newStatus },
  //       {
  //         onSuccess: () => {
  //           toast({
  //             title: 'Status diperbarui',
  //             description: `Member telah berhasil ${
  //               newStatus === INACTIVE ? 'di Non-Aktifkan' : 'di Aktifkan'
  //             }`,
  //           });
  //           closeModal();
  //         },
  //         onError: (error) => {
  //           let message = 'Gagal mengubah status member.';
  //           if (isAxiosError(error)) {
  //             message = error.response?.data?.message || message;
  //           }
  //           toast({
  //             variant: 'destructive',
  //             title: 'Gagal mengubah status member',
  //             description: message,
  //           });
  //         },
  //       },
  //     );
  //   };

  const mock_invitations = {
    items: [
      {
        id: 1,
        name: 'Rendy & Winka',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/invite/rendy-winka`,
        status: 'Published',
        date_event: '2026-02-02',
        total_view: 10,
        rsvp: '45 / 100 Tamu',
        createdAt: '2026-01-01',
      },
    ],
    total: 1,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Undangan
          </h1>
          <p className="text-muted-foreground text-sm">
            Total {mock_invitations.total} undangan terdaftar
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
                // value={searchTerm}
                // onChange={onSearchChange}
                className="border-border focus:ring-primary h-10 bg-transparent pl-9 text-sm focus:ring-1"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark h-10 cursor-pointer px-4 transition-colors"
              //   onClick={() => setIsFilterSidebarOpen(true)}
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
                <th className="px-6 py-4 font-semibold">RSVP</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {false ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Memuat data undangan...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : mock_invitations.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="text-primary fill-primary h-8 w-8" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Tidak ada data undangan.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                mock_invitations.items.map((invitation) => (
                  <tr
                    key={invitation.id}
                    className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold">
                      <Link
                        href={invitation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary font-semibold transition-colors hover:underline"
                      >
                        {invitation.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          invitation.status === 'Published'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {invitation.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {formatDate(invitation.date_event)}
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {invitation.total_view} Kunjungan
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {invitation.rsvp} Konfirmasi
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary hover:bg-secondary h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                                //   onClick={() => handleOpenModal('share', invitation)}
                              >
                                <Share className="h-3.5 w-3.5" />
                                Share
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                                //   onClick={() => handleOpenModal('edit', invitation)}
                              >
                                <SquarePen className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                                //   onClick={() => handleOpenModal('delete', invitation)}
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

        {/* <Pagination
          page={filters.page}
          totalPages={totalPages}
          limit={filters.limit}
          totalItems={totalItems}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          onLimitChange={(l) =>
            setFilters((f) => ({ ...f, limit: l, page: 1 }))
          }
          isLoading={isLoading}
        /> */}
      </div>

      {/* <CreateMemberModal
        isOpen={activeModal === 'create'}
        onClose={closeModal}
      /> */}

      {/* {selectedMember && (
        <EditMemberModal
          isOpen={activeModal === 'edit'}
          onClose={closeModal}
          member={selectedMember}
        />
      )} */}

      {/* <DeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={`Hapus Member ${selectedMember?.name}?`}
      /> */}

      {/* <DeactiveModal
        isOpen={activeModal === 'status'}
        onClose={closeModal}
        onConfirm={handleUpdateStatus}
        isLoading={isStatusUpdating}
        member={selectedMember}
      /> */}

      {/* <FilterMemberSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        packageIdFilter={filters.packageId}
        statusFilter={filters.status}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      /> */}
    </div>
  );
}
