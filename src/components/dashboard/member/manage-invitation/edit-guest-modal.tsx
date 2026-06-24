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
import { useUpdateInvitationGuest } from '@/hooks/api/use-invitation-guest';
import { useToast } from '@/hooks/use-toast';
import { InvitationGuest } from '@/types/guest.type';
import {
  CreateUpdateInvitationGuestFormValues,
  createUpdateInvitationGuestSchema,
} from '@/validations/member/create-update-guest';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface EditInvitationGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: InvitationGuest;
}

export default function EditInvitationGuestModal({
  isOpen,
  onClose,
  guest,
}: EditInvitationGuestModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateUpdateInvitationGuestFormValues>({
    resolver: zodResolver(createUpdateInvitationGuestSchema),
    defaultValues: {
      guestName: guest.guestName,
      phoneNumber: guest.phoneNumber || undefined,
      status: guest.status as GuestStatusEnum | undefined,
      invitationId: guest.invitationId,
    },
  });

  const { mutate, isPending } = useUpdateInvitationGuest();

  const onSubmit = (data: CreateUpdateInvitationGuestFormValues) => {
    mutate(
      { id: guest.id, ...data },
      {
        onSuccess: () => {
          toast({
            title: 'Tamu berhasil diperbarui',
            variant: 'default',
            description: `Informasi tamu ${data.guestName} berhasil diperbarui!`,
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
              Ubah informasi tamu di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="invitationId"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                ID Undangan
              </Label>
              <Input
                id="invitationId"
                value={guest.invitationId}
                disabled
                className="bg-secondary/10 border-border/40 h-11 cursor-not-allowed text-sm transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="guestName"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Nama Tamu
              </Label>
              <Input
                id="guestName"
                placeholder="Masukkan nama tamu..."
                {...register('guestName')}
                className={`bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent ${errors.guestName ? 'border-destructive' : ''}`}
              />
              {errors.guestName && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.guestName.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                No WhatsApp
              </Label>
              <Input
                id="phoneNumber"
                placeholder="Contoh: 6281234567890"
                {...register('phoneNumber')}
                className={`bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent ${errors.phoneNumber ? 'border-destructive' : ''}`}
              />
              {errors.phoneNumber && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.phoneNumber.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Status
              </Label>
              <div className="relative">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : ''}
                      disabled
                    >
                      <SelectTrigger
                        className={`bg-secondary/5 border-border/40 h-11 text-sm ${errors.status ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder="Pilih status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={GuestStatusEnum.Draft}>
                          Draft
                        </SelectItem>
                        <SelectItem value={GuestStatusEnum.Sent}>
                          Terkirim
                        </SelectItem>
                        <SelectItem value={GuestStatusEnum.Opened}>
                          Dibuka
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.status && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.status.message as string}
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
