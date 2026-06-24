'use client';

import CreateInvitationGuestModal from '@/components/dashboard/member/manage-invitation/create-guest-modal';
import EditInvitationGuestModal from '@/components/dashboard/member/manage-invitation/edit-guest-modal';
import DeleteModal from '@/components/shared/delete-modal';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import {
  useDeleteInvitationGuest,
  useGetInvitationGuests,
  useUpdateInvitationGuest,
} from '@/hooks/api/use-invitation-guest';
import { useToast } from '@/hooks/use-toast';
import { InvitationGuest } from '@/types/guest.type';
import { ModalType } from '@/types/modal.type';
import { CreateUpdateInvitationGuestFormValues } from '@/validations/member/create-update-guest';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  CheckCircle2,
  Circle,
  Copy,
  Filter,
  Heart,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Send,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function ManageInvitationPage() {
  const [isCopied, setIsCopied] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedGuest, setSelectedGuest] = useState<InvitationGuest | null>(
    null,
  );
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    invitationId: undefined as number | undefined,
    status: undefined as GuestStatusEnum | undefined,
    page: 1,
    limit: 10,
  });

  const { data: guestData, isLoading } = useGetInvitationGuests({
    search: filters.search,
    invitationId: filters.invitationId,
    status: filters.status,
    page: filters.page,
    limit: filters.limit,
  });
  const { toast } = useToast();

  const handleSearch = useDebouncedCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  }, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const { mutate: deleteGuest, isPending: isDeleting } =
    useDeleteInvitationGuest();
  const { mutate: updateGuest, isPending: isUpdating } =
    useUpdateInvitationGuest();

  const guests = guestData?.items || [];
  const totalItems = guestData?.total || 0;
  const totalPages = Math.ceil(totalItems / filters.limit);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedGuest(null);
  };

  const handleOpenModal = (type: ModalType, guest?: InvitationGuest) => {
    if (guest) setSelectedGuest(guest);
    setActiveModal(type);
  };

  const handleApplyFilter = (newFilters: {
    invitationId?: number;
    status?: GuestStatusEnum;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({
      search: '',
      invitationId: undefined,
      status: undefined,
      page: 1,
      limit: 10,
    });
    setSearchTerm('');
  };

  const handleDelete = () => {
    if (!selectedGuest) return;
    deleteGuest(selectedGuest.id, {
      onSuccess: () => {
        toast({
          title: 'Tamu dihapus',
          description: 'Tamu telah berhasil dihapus dari sistem.',
        });
        closeModal();
      },
      onError: (error) => {
        let message = 'Gagal menghapus tamu.';
        if (isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }
        toast({
          variant: 'destructive',
          title: 'Gagal menghapus tamu',
          description: message,
        });
      },
    });
  };

  const handleUpdate = (data: CreateUpdateInvitationGuestFormValues) => {
    if (!selectedGuest) return;
    updateGuest(
      { id: selectedGuest.id, ...data },
      {
        onSuccess: () => {
          toast({
            title: 'Tamu berhasil diperbarui',
            description: 'Informasi tamu berhasil diperbarui.',
          });
          closeModal();
        },
        onError: (error) => {
          let message = 'Gagal memperbarui tamu.';
          if (isAxiosError(error)) {
            message = error.response?.data?.message || message;
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui tamu',
            description: message,
          });
        },
      },
    );
  };

  const handleCopyLink = (guestId: number, guestName: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/invitation/preview?to=${encodeURIComponent(guestName)}&id=${guestId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(guestId);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleSendWA = (guest: InvitationGuest) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/invitation/preview?to=${encodeURIComponent(guest.guestName)}&id=${guest.id}`;

    const message = `Halo *${guest.guestName}*,\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir di acara pernikahan kami.\n\nSilakan buka undangan digital kami pada tautan berikut:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.\n\nTerima kasih.`;

    if (guest.phoneNumber) {
      window.open(
        `https://wa.me/${guest.phoneNumber}?text=${encodeURIComponent(message)}`,
        '_blank',
      );
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        '_blank',
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Kelola Tamu
          </h1>
          <p className="text-muted-foreground text-sm">
            Total {totalItems} tamu terdaftar di undangan ini
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
          onClick={() => handleOpenModal('create')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tamu
        </Button>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Cari nama tamu..."
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
                <th className="px-6 py-4 font-semibold">Nama Tamu</th>
                <th className="px-6 py-4 font-semibold">Undangan</th>
                <th className="px-6 py-4 font-semibold">No. WhatsApp</th>
                <th className="px-6 py-4 font-semibold">Status Dibuka</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Memuat data tamu...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="text-primary fill-primary h-8 w-8" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Belum ada tamu terdaftar.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                guests.map((guest: InvitationGuest) => (
                  <tr
                    key={guest.id}
                    className="even:bg-secondary/10 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold">
                      {guest.guestName}
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs font-medium">
                      Undangan #{guest.invitationId}
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-xs">
                      {guest.phoneNumber ? `+${guest.phoneNumber}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {guest.status === GuestStatusEnum.Opened ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="text-success h-4 w-4" />
                          <span className="text-success text-xs font-medium">
                            Dibuka
                          </span>
                          <span className="text-muted-foreground ml-1 text-[10px]">
                            (
                            {format(
                              new Date(guest.updatedAt),
                              'dd MMM yyyy, HH:mm',
                              { locale: id },
                            )}
                            )
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Circle className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground text-xs font-medium">
                            Belum Dibuka
                          </span>
                        </div>
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
                          <PopoverContent align="end" className="w-40 p-1">
                            <div className="flex flex-col gap-0.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendWA(guest)}
                                className="hover:bg-primary/10 text-primary-dark hover:text-primary-dark h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                              >
                                <Send className="h-3.5 w-3.5" />
                                Kirim Whatsapp
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopyLink(guest.id, guest.guestName)
                                }
                                className="text-primary-dark hover:text-primary-dark hover:bg-primary/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                              >
                                {isCopied === guest.id ? (
                                  <CheckCircle2 className="text-success h-3.5 w-3.5" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                                {isCopied === guest.id
                                  ? 'Tersalin!'
                                  : 'Copy Link'}
                              </Button>
                              <div className="bg-border my-1 h-px w-full" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary-dark hover:text-primary-dark hover:bg-primary/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                                onClick={() => handleOpenModal('edit', guest)}
                              >
                                <SquarePen className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenModal('delete', guest)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
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

        <CreateInvitationGuestModal
          isOpen={activeModal === 'create'}
          onClose={closeModal}
        />

        {selectedGuest && (
          <EditInvitationGuestModal
            isOpen={activeModal === 'edit'}
            onClose={closeModal}
            guest={selectedGuest}
          />
        )}

        <DeleteModal
          isOpen={activeModal === 'delete'}
          onClose={closeModal}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title={`Hapus Tamu ${selectedGuest?.guestName}?`}
        />
      </div>
    </div>
  );
}
