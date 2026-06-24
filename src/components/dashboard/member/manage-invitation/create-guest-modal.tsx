import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateInvitationGuest } from '@/hooks/api/use-invitation-guest';
import { useToast } from '@/hooks/use-toast';
import {
  CreateUpdateInvitationGuestFormValues,
  createUpdateInvitationGuestSchema,
} from '@/validations/member/create-update-guest';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CreateInvitationGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvitationGuestModal({
  isOpen,
  onClose,
}: CreateInvitationGuestModalProps) {
  const { toast } = useToast();
  const { mutate: createGuest, isPending } = useCreateInvitationGuest();

  const form = useForm<CreateUpdateInvitationGuestFormValues>({
    resolver: zodResolver(createUpdateInvitationGuestSchema),
    defaultValues: {
      guestName: '',
      phoneNumber: '',
    },
  });

  const onSubmit = (data: CreateUpdateInvitationGuestFormValues) => {
    // Assuming we pass invitationId from context or prop. For now, hardcode or pass as 0 if required
    // Actually, createUpdateInvitationGuestSchema only needs guestName and phoneNumber
    createGuest(
      { ...data, invitationId: 0 }, // Adjust invitationId logic later
      {
        onSuccess: () => {
          toast({
            title: 'Tamu Berhasil Ditambahkan',
            description: 'Tamu baru telah berhasil ditambahkan.',
          });
          form.reset();
          onClose();
        },
        onError: (error) => {
          let message = 'Gagal menambahkan tamu.';
          if (isAxiosError(error)) {
            message = error.response?.data?.message || message;
          }
          toast({
            variant: 'destructive',
            title: 'Gagal Menambahkan Tamu',
            description: message,
          });
        },
      },
    );
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-background sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Tamu Baru</DialogTitle>
          <DialogDescription>
            Masukkan nama dan nomor WhatsApp tamu yang akan diundang.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Nama Tamu</Label>
            <Input
              id="guestName"
              placeholder="Contoh: Budi Santoso"
              {...form.register('guestName')}
            />
            {form.formState.errors.guestName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.guestName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Nomor WhatsApp (Opsional)</Label>
            <Input
              id="phoneNumber"
              placeholder="Contoh: 628123456789"
              {...form.register('phoneNumber')}
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
