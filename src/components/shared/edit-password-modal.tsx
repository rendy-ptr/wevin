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
import { useUpdatePassword } from '@/hooks/api/use-setting';
import { useToast } from '@/hooks/use-toast';
import {
  UpdatePasswordFormValues,
  updatePasswordSchema,
} from '@/validations/admin/create-update-setting';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function EditPasswordModal({
  isOpen,
  onClose,
  userId,
}: EditPasswordModalProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });
  const { toast } = useToast();
  const { mutate: updatePassword, isPending: isPendingUpdatePassword } =
    useUpdatePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleUpdatePassword = (data: UpdatePasswordFormValues) => {
    updatePassword(
      { id: userId, ...data },
      {
        onSuccess: (res) => {
          toast({
            title: 'Password berhasil diperbarui',
            variant: 'default',
            description: `Password ${res.data.name} berhasil diperbarui!`,
          });
          onClose();
          reset();
        },
        onError: (error) => {
          let message = 'Gagal memperbarui password. Silakan coba lagi.';
          if (isAxiosError(error)) {
            message =
              error.response?.data?.message ||
              'Gagal memperbarui password. Silakan coba lagi.';
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui password',
            description: message,
          });
        },
      },
    );
  };

  const toggleShowPassword = (type: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleCloseModal = () => {
    setShowPassword({
      oldPassword: false,
      password: false,
      confirmPassword: false,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-[420px]">
        <form onSubmit={handleSubmit(handleUpdatePassword)} className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              Perbarui Password
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Ubah kata sandi keamanan akun Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="dialog-old-password"
                  className="text-foreground font-medium"
                >
                  Password Lama
                </Label>
              </div>
              <div className="relative">
                <Input
                  {...register('oldPassword')}
                  id="dialog-old-password"
                  type={showPassword.oldPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl pr-12 ${
                    errors.oldPassword ? 'border-destructive' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('oldPassword')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  aria-label={
                    showPassword.oldPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword.oldPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-destructive text-xs italic">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="dialog-new-password"
                  className="text-foreground font-medium"
                >
                  Password Baru
                </Label>
              </div>
              <div className="relative">
                <Input
                  {...register('password')}
                  id="dialog-password"
                  type={showPassword.password ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl pr-12 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('password')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  aria-label={
                    showPassword.password ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword.password ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs italic">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="dialog-confirm-password"
                  className="text-foreground font-medium"
                >
                  Konfirmasi Password Baru
                </Label>
              </div>
              <div className="relative">
                <Input
                  {...register('confirmPassword')}
                  id="dialog-confirm-password"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className={`border-border bg-background focus:border-primary focus:ring-primary h-12 rounded-xl pr-12 ${
                    errors.confirmPassword ? 'border-destructive' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirmPassword')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  aria-label={
                    showPassword.confirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-xs italic">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isPendingUpdatePassword}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPendingUpdatePassword}
              className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {isPendingUpdatePassword ? (
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
