'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GuestStatusEnum } from '@/enums/invitation.enum';
import { useGetInvitations } from '@/hooks/api/use-invitation';
import { useUpdateInvitationGuest } from '@/hooks/api/use-invitation-guest';
import { useToast } from '@/hooks/use-toast';
import { GuestItem } from '@/types/guestbook.type';
import {
  CreateUpdateInvitationGuestFormValues,
  createUpdateInvitationGuestSchema,
} from '@/validations/member/create-update-guest';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface EditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestItem;
}

export default function EditGuestModal({
  isOpen,
  onClose,
  guest,
}: EditGuestModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUpdateInvitationGuestSchema),
    defaultValues: {
      invitationId: guest.invitationId,
      guestName: guest.guestName,
      phoneNumber: guest.phoneNumber || '',
      status: guest.status as GuestStatusEnum,
    },
  });

  const { data: invitationsData, isLoading: isLoadingInvitations } =
    useGetInvitations({
      limit: 100,
    });
  const invitations = invitationsData?.data || [];

  const { mutate, isPending } = useUpdateInvitationGuest();

  useEffect(() => {
    if (isOpen && guest) {
      reset({
        invitationId: guest.invitationId,
        guestName: guest.guestName,
        phoneNumber: guest.phoneNumber || '',
        status: guest.status as GuestStatusEnum,
      });
    }
  }, [isOpen, guest, reset]);

  const onSubmit = (data: CreateUpdateInvitationGuestFormValues) => {
    mutate(
      { ...data, id: guest.id },
      {
        onSuccess: () => {
          toast({
            title: 'Tamu berhasil diperbarui',
            variant: 'default',
            description: `Data tamu ${data.guestName} berhasil diperbarui!`,
          });
          onClose();
          reset();
        },
        onError: (error) => {
          let message = 'Gagal memperbarui tamu. Silakan coba lagi.';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-[420px]">
        <form onSubmit={handleSubmit(onSubmit)} className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              Edit Tamu
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Perbarui data tamu di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Pilih Undangan (Tidak Bisa Diubah){' '}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Controller
                  name="invitationId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <SelectTrigger className="bg-secondary/10 border-border/40 h-11 cursor-not-allowed text-sm opacity-60">
                        <SelectValue
                          placeholder={
                            isLoadingInvitations
                              ? 'Memuat undangan...'
                              : 'Pilih undangan...'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {invitations.map(
                          (inv: {
                            id: number;
                            groomName: string;
                            brideName: string;
                          }) => (
                            <SelectItem
                              key={inv.id}
                              value={String(inv.id)}
                              className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                            >
                              {inv.groomName} & {inv.brideName}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="guestName"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Nama Tamu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="guestName"
                placeholder="Masukkan nama tamu..."
                {...register('guestName')}
                className={`bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent ${errors.guestName ? 'border-destructive' : ''}`}
              />
              {errors.guestName && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.guestName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                No WhatsApp (Opsional)
              </Label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="Contoh: 08123456789"
                {...register('phoneNumber')}
                className={`bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent ${errors.phoneNumber ? 'border-destructive' : ''}`}
              />
              {errors.phoneNumber && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
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
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <span className="invisible text-transparent">Simpan</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
