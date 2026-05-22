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
import { useUpdateName } from '@/hooks/api/use-setting';
import { useToast } from '@/hooks/use-toast';
import { TUser } from '@/types/user.type';
import {
  UpdateNameFormValues,
  updateNameSchema,
} from '@/validations/admin/create-update-setting';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditProfileNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: TUser;
}

export default function EditProfileNameModal({
  isOpen,
  onClose,
  user,
}: EditProfileNameModalProps) {
  const { toast } = useToast();
  const { mutate: updateName, isPending: isPendingUpdateName } =
    useUpdateName();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: user.name });
    }
  }, [isOpen, user.name, reset]);

  const handleUpdateName = (data: UpdateNameFormValues) => {
    updateName(
      { id: user.id, ...data },
      {
        onSuccess: (res) => {
          toast({
            title: 'Nama berhasil diperbarui',
            variant: 'default',
            description: `Nama ${res.data.name} berhasil diperbarui!`,
          });
          onClose();
          reset();
        },
        onError: (error) => {
          let message = 'Gagal memperbarui nama. Silakan coba lagi.';
          if (isAxiosError(error)) {
            message =
              error.response?.data?.message ||
              'Gagal memperbarui nama. Silakan coba lagi.';
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui nama',
            description: message,
          });
        },
      },
    );
  };

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-[420px]">
        <form onSubmit={handleSubmit(handleUpdateName)} className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              Perbarui Nama
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Ubah nama akun Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="dialog-name"
                  className="text-foreground font-medium"
                >
                  Nama
                </Label>
              </div>
              <Input
                {...register('name')}
                id="dialog-name"
                type="text"
                placeholder="Masukkan nama"
                className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl pr-12 ${
                  errors.name ? 'border-destructive' : ''
                }`}
              />
              {errors.name && (
                <p className="text-destructive text-xs italic">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isPendingUpdateName}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPendingUpdateName}
              className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {isPendingUpdateName ? (
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
