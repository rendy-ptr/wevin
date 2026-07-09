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
import { useGetInvitationOptions } from '@/hooks/api/use-invitation';
import { useCreateInvitationGuest } from '@/hooks/api/use-invitation-guest';
import { useToast } from '@/hooks/use-toast';
import {
  CreateUpdateInvitationGuestFormValues,
  createUpdateInvitationGuestSchema,
} from '@/validations/member/create-update-guest';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface CreateGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGuestModal({
  isOpen,
  onClose,
}: CreateGuestModalProps) {
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
      invitationId: 0,
      guestName: '',
      phoneNumber: '',
    },
  });

  const { data: invitationsData, isLoading: isLoadingInvitations } =
    useGetInvitationOptions();
  const invitations = invitationsData || [];

  const { mutate, isPending } = useCreateInvitationGuest();

  const onSubmit = (data: CreateUpdateInvitationGuestFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: 'Tamu berhasil ditambahkan',
          variant: 'default',
          description: `Tamu ${data.guestName} berhasil ditambahkan!`,
        });
        onClose();
        reset();
      },
      onError: (error) => {
        let message = 'Gagal menambahkan tamu. Silakan coba lagi.';
        if (isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }
        toast({
          variant: 'destructive',
          title: 'Gagal menambahkan tamu',
          description: message,
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-[420px]">
        <form onSubmit={handleSubmit(onSubmit)} className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              Tambah Tamu
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Isi data berikut untuk mendaftarkan tamu undangan.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Pilih Undangan <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Controller
                  name="invitationId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ''}
                      disabled={isLoadingInvitations}
                    >
                      <SelectTrigger
                        className={`bg-secondary/5 border-border/40 h-11 text-sm ${errors.invitationId ? 'border-destructive' : ''}`}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingInvitations
                              ? 'Memuat undangan...'
                              : invitations.length === 0
                                ? 'Belum ada undangan'
                                : 'Pilih undangan...'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {invitations.length === 0 ? (
                          <SelectItem
                            value="0"
                            disabled
                            className="text-muted-foreground text-xs"
                          >
                            Belum ada undangan
                          </SelectItem>
                        ) : (
                          invitations.map(
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
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.invitationId && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.invitationId.message}
                </p>
              )}
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
