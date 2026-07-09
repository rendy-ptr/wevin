'use client';

import CreateGuestModal from '@/components/dashboard/member/create-guest-modal';
import EditGuestModal from '@/components/dashboard/member/edit-guest-modal';
import FilterGuestSidebar from '@/components/dashboard/member/filter-guest-sidebar';
import ImportGuestModal from '@/components/dashboard/member/import-guest-modal';
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
import { API_URL } from '@/constants/url';
import { GuestStatusEnum, RSVPStatusEnum } from '@/enums/invitation.enum';
import {
  useDeleteInvitationGuest,
  useGetInvitationGuests,
} from '@/hooks/api/use-invitation-guest';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { formatDate } from '@/lib/date';
import { GuestItem } from '@/types/guestbook.type';
import { ModalType } from '@/types/modal.type';
import { isAxiosError } from 'axios';
import {
  CheckCircle,
  Download,
  Eye,
  Filter,
  Heart,
  Link2,
  Loader2,
  MessageCircle,
  MoreVertical,
  OctagonX,
  Plus,
  Search,
  SquarePen,
  Trash2,
  Upload,
} from 'lucide-react';
import Papa from 'papaparse';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function MemberGuestbooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: undefined as GuestStatusEnum | undefined,
    invitationId: undefined as number | undefined,
    page: 1,
    limit: 10,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedGuest, setSelectedGuest] = useState<GuestItem | null>(null);

  const { data: guestsData, isLoading } = useGetInvitationGuests({
    search: filters.search,
    status: filters.status,
    invitationId: filters.invitationId,
    page: filters.page,
    limit: filters.limit,
  });

  const { mutate: deleteGuest, isPending: isPendingDelete } =
    useDeleteInvitationGuest();

  const { toast } = useToast();

  const handleDelete = () => {
    if (!selectedGuest) return;
    deleteGuest(selectedGuest.id, {
      onSuccess: () => {
        toast({
          title: 'Tamu dihapus',
          description: 'Data tamu berhasil dihapus.',
        });
        closeModal();
      },
      onError: (error) => {
        let message = 'Gagal menghapus data tamu.';
        if (isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }
        toast({
          variant: 'destructive',
          title: 'Gagal',
          description: message,
        });
      },
    });
  };

  const guests = guestsData?.items || [];
  const totalItems = guestsData?.total || 0;
  const totalPages = Math.ceil(totalItems / filters.limit) || 1;

  const handleSearch = useDebouncedCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  }, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleApplyFilter = (newFilters: {
    status?: GuestStatusEnum | undefined;
    invitationId?: number;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilter = () => {
    setFilters({
      search: '',
      status: undefined,
      invitationId: undefined,
      page: 1,
      limit: 10,
    });
    setSearchTerm('');
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const response = await api.get(API_URL.GUEST.EXPORT);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Gagal mengambil data tamu');
      }

      const guests = response.data.data;

      if (!guests || guests.length === 0) {
        toast({
          title: 'Tidak Ada Data',
          description: 'Tidak ada data tamu untuk diekspor',
          variant: 'destructive',
        });
        return;
      }

      const GUEST_STATUS_LABEL: Record<string, string> = {
        [GuestStatusEnum.Idle]: 'Belum Dibuka',
        [GuestStatusEnum.Opened]: 'Dibuka',
        [GuestStatusEnum.Responded]: 'Merespon',
      };

      const RSVP_STATUS_LABEL: Record<string, string> = {
        [RSVPStatusEnum.Present]: 'Hadir',
        [RSVPStatusEnum.NotPresent]: 'Tidak Hadir',
      };

      const csvData = guests.map((guest: GuestItem) => ({
        'Nama Tamu': guest.guestName,
        'Nama Undangan': guest.invitation
          ? `${guest.invitation.groomName} & ${guest.invitation.brideName}`
          : '-',
        'No. WhatsApp': guest.phoneNumber || '-',
        'Status Undangan': GUEST_STATUS_LABEL[guest.status] || guest.status,
        'Kehadiran (RSVP)':
          RSVP_STATUS_LABEL[
            guest.rsvp?.status as keyof typeof RSVP_STATUS_LABEL
          ] || 'Belum Konfirmasi',
        'Jumlah Tamu': guest.rsvp?.guestCount || 0,
        Ucapan: guest.wishes?.message || '-',
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute(
        'download',
        `Data_Tamu_Wevin_${formatDate(new Date())}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Berhasil',
        description: `${guests.length} data tamu berhasil diexspor`,
      });
    } catch (error: unknown) {
      toast({
        title: 'Gagal Export',
        description:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat mengekspor data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenModal = (type: ModalType, guest?: GuestItem) => {
    if (guest) setSelectedGuest(guest);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedGuest(null);
  };

  const handleCopyLink = (guest: GuestItem) => {
    if (!guest.invitation?.slug) {
      toast({
        variant: 'destructive',
        title: 'Gagal menyalin',
        description: 'Undangan tidak memiliki URL yang valid.',
      });
      return;
    }
    const url = `${window.location.origin}/invite/${guest.invitation.slug}?to=${encodeURIComponent(guest.guestName)}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link disalin!',
      description: `Link undangan untuk ${guest.guestName} berhasil disalin.`,
    });
  };

  const handleSendWhatsapp = (guest: GuestItem) => {
    if (!guest.invitation?.slug) {
      toast({
        variant: 'destructive',
        title: 'Gagal mengirim',
        description: 'Undangan tidak memiliki URL yang valid.',
      });
      return;
    }
    if (!guest.phoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Gagal mengirim',
        description: 'Tamu tidak memiliki nomor WhatsApp.',
      });
      return;
    }
    const url = `${window.location.origin}/invite/${guest.invitation.slug}?to=${encodeURIComponent(guest.guestName)}`;

    let phone = guest.phoneNumber.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    }

    const text = `Kepada Yth. Bapak/Ibu/Saudara/i ${guest.guestName},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir di acara pernikahan kami.\n\nBerikut link undangan Anda:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case GuestStatusEnum.Idle:
        return (
          <span className="bg-muted text-muted-foreground inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium">
            <OctagonX className="mr-1 h-3 w-3" /> Belum Dikirim
          </span>
        );

      case GuestStatusEnum.Opened:
        return (
          <span className="bg-accent text-accent-foreground inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium">
            <Eye className="mr-1 h-3 w-3" /> Dibuka
          </span>
        );
      case GuestStatusEnum.Responded:
        return (
          <span className="inline-flex items-center rounded-sm bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" /> Merespon
          </span>
        );
      default:
        return (
          <span className="bg-muted text-muted-foreground inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl font-bold">
            Buku Tamu
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola daftar tamu undangan Anda ({totalItems} tamu)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenModal('import')}
            className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 hover:text-primary-dark h-11 px-4 font-medium shadow-sm transition-all active:scale-95 sm:px-6"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 hover:text-primary-dark h-11 px-4 font-medium shadow-sm transition-all active:scale-95 sm:px-6"
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
          <Button
            onClick={() => handleOpenModal('create')}
            className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Tamu
          </Button>
        </div>
      </div>

      <div className="bg-background border-border overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Cari nama tamu..."
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
                <th className="px-6 py-4 font-semibold">Nama Tamu</th>
                <th className="px-6 py-4 font-semibold">Undangan</th>
                <th className="px-6 py-4 font-semibold">Kontak</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Kehadiran (RSVP)</th>
                <th className="px-6 py-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="h-32 text-center">
                    <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="text-primary fill-primary h-8 w-8" />
                      <p className="text-muted-foreground text-xs font-medium">
                        Tidak ada data tamu ditemukan.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                guests.map((guest: GuestItem) => (
                  <tr
                    key={guest.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{guest.guestName}</div>
                      <div className="text-muted-foreground text-xs">
                        {formatDate(guest.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {guest.invitation ? (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {guest.invitation.groomName} &{' '}
                            {guest.invitation.brideName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {guest.phoneNumber ? (
                        <span className="text-sm">{guest.phoneNumber}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          Belum diisi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="w-max cursor-help">
                              {getStatusBadge(guest.status)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Diperbarui pada: {formatDate(guest.updatedAt)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="px-6 py-4">
                      {guest.rsvp ? (
                        guest.rsvp.status === RSVPStatusEnum.Present ? (
                          <span className="text-xs font-medium text-green-600">
                            Hadir ({guest.rsvp.guestCount} orang)
                          </span>
                        ) : (
                          <span className="text-destructive text-xs font-medium">
                            Tidak Hadir
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          Belum RSVP
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-primary-dark hover:text-primary-dark hover:bg-secondary h-8 w-8 transition-colors"
                          >
                            <MoreVertical className="text-muted-foreground h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-36 p-1">
                          <Button
                            variant="ghost"
                            className="text-primary-dark hover:text-primary-dark hover:bg-primary/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                            onClick={() => handleCopyLink(guest)}
                          >
                            <Link2 className="mr-2 h-4 w-4" /> Salin Link
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-primary-dark hover:text-primary-dark hover:bg-primary/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                            onClick={() => handleSendWhatsapp(guest)}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" /> Kirim WA
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-primary-dark hover:text-primary-dark hover:bg-primary/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                            onClick={() => handleOpenModal('edit', guest)}
                          >
                            <SquarePen className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs font-medium"
                            onClick={() => handleOpenModal('delete', guest)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </Button>
                        </PopoverContent>
                      </Popover>
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

      {activeModal === 'create' && (
        <CreateGuestModal isOpen={true} onClose={closeModal} />
      )}

      {activeModal === 'import' && (
        <ImportGuestModal isOpen={true} onClose={closeModal} />
      )}

      {activeModal === 'edit' && selectedGuest && (
        <EditGuestModal
          isOpen={true}
          onClose={closeModal}
          guest={selectedGuest}
        />
      )}

      <DeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        isLoading={isPendingDelete}
        title={`Hapus Tamu ${selectedGuest?.guestName}?`}
      />

      <FilterGuestSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        statusFilter={filters.status}
        invitationIdFilter={filters.invitationId}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
}
