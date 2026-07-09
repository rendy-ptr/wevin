import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetInvitationOptions } from '@/hooks/api/use-invitation';
import { useBulkCreateInvitationGuests } from '@/hooks/api/use-invitation-guest';
import { useToast } from '@/hooks/use-toast';
import { CreateUpdateInvitationGuestFormValues } from '@/validations/member/create-update-guest';
import { Download, Loader2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { useRef, useState } from 'react';

type ImportGuestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ImportGuestModal({
  isOpen,
  onClose,
}: ImportGuestModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>('');

  const { data: invitationsData, isLoading: isLoadingInvitations } =
    useGetInvitationOptions();

  const { mutateAsync: bulkCreate, isPending } =
    useBulkCreateInvitationGuests();

  const handleDownloadTemplate = () => {
    const csvContent =
      'Nama Tamu,No. WhatsApp\nBudi Santoso,081234567890\nSiti Aminah,089876543210';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'template_tamu_wevin.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) return;
    if (!selectedInvitationId) {
      toast({
        title: 'Pilih Undangan',
        description: 'Silakan pilih undangan terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const payloads: CreateUpdateInvitationGuestFormValues[] = (
            results.data as Record<string, string>[]
          )
            .map((row) => {
              const name = row['Nama Tamu']?.trim();
              const phone = row['No. WhatsApp']?.trim();

              if (!name) return null;

              return {
                invitationId: Number(selectedInvitationId),
                guestName: name,
                phoneNumber: phone || null,
              };
            })
            .filter(Boolean) as CreateUpdateInvitationGuestFormValues[];

          if (payloads.length === 0) {
            toast({
              title: 'Format tidak valid',
              description:
                'Pastikan file CSV sesuai dengan template (Kolom "Nama Tamu" wajib diisi)',
              variant: 'destructive',
            });
            return;
          }

          await bulkCreate(payloads);
          toast({
            title: 'Berhasil Import',
            description: `${payloads.length} tamu berhasil ditambahkan`,
          });
          setFile(null);
          onClose();
        } catch (error: unknown) {
          toast({
            title: 'Gagal Import',
            description:
              error instanceof Error
                ? error.message
                : 'Terjadi kesalahan saat mengimpor data',
            variant: 'destructive',
          });
        }
      },
      error: (error) => {
        toast({
          title: 'Gagal Membaca File',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Data Tamu (CSV)</DialogTitle>
          <DialogDescription>
            Unduh template file CSV, isi data tamu, dan unggah kembali untuk
            menambahkan tamu sekaligus banyak.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">
              Pilih Undangan Tujuan
            </Label>
            <Select
              value={selectedInvitationId}
              onValueChange={setSelectedInvitationId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih undangan untuk impor tamu..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingInvitations ? (
                  <div className="text-muted-foreground flex items-center justify-center p-4 text-sm">
                    Memuat data undangan...
                  </div>
                ) : (
                  invitationsData?.map(
                    (inv: {
                      id: number;
                      groomName: string;
                      brideName: string;
                    }) => (
                      <SelectItem
                        className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                        key={inv.id}
                        value={inv.id.toString()}
                      >
                        {inv.groomName} & {inv.brideName}
                      </SelectItem>
                    ),
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-border h-px w-full" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 text-left">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold">
                  1
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold">Unduh Template</h4>
                  <p className="text-muted-foreground text-xs leading-snug">
                    Gunakan file CSV ini untuk mengisi data tamu.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="border-border hover:bg-primary/10 hover:text-primary-dark focus:bg-primary/10 focus:text-primary-dark h-8 shrink-0 cursor-pointer px-4 text-xs transition-colors"
              >
                <Download className="h-2 w-2" />
                Unduh
              </Button>
            </div>

            <div
              className={`flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-center ${
                file ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold">
                  2
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold">Unggah File</h4>
                  <p className="text-muted-foreground text-xs leading-snug">
                    {file
                      ? 'File siap untuk diimpor.'
                      : 'Upload CSV yang sudah diisi.'}
                  </p>
                </div>
              </div>

              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                variant={file ? 'default' : 'outline'}
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-border hover:bg-primary/10 hover:text-primary-dark focus:bg-primary/10 focus:text-primary-dark h-8 shrink-0 cursor-pointer px-4 text-xs transition-colors"
              >
                <Upload className="h-2 w-2" />
                {file ? 'Ganti File' : 'Unggah'}
              </Button>
            </div>
          </div>

          {file && (
            <div className="bg-primary/10 text-primary-dark mt-1 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium">
              <div className="flex items-center gap-2 truncate">
                <Upload className="h-4 w-4 shrink-0" />
                <span className="truncate">{file.name}</span>
              </div>
              <span className="shrink-0 text-xs opacity-70">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
          >
            Batal
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isPending}
            className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
          >
            {isPending ? (
              <>
                <span className="invisible text-transparent">Import</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </>
            ) : (
              'Import'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
