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
import { useUpdateNameAndEmail } from '@/hooks/api/use-setting';
import { useToast } from '@/hooks/use-toast';
import { TUser } from '@/types/user.type';
import {
  UpdateNameAndEmailFormValues,
  updateNameAndEmailSchema,
} from '@/validations/admin/create-update-member';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Pick<TUser, 'name' | 'email' | 'id'>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateNameAndEmailFormValues>({
    resolver: zodResolver(updateNameAndEmailSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });
  const { mutate: updateNameAndEmail, isPending: isPendingUpdateNameAndEmail } =
    useUpdateNameAndEmail();

  const handleUpdateNameAndEmail = (data: UpdateNameAndEmailFormValues) => {
    updateNameAndEmail(
      { id: user.id, ...data },
      {
        onSuccess: (res) => {
          toast({
            title: 'Profil berhasil diperbarui',
            variant: 'default',
            description: `Profil ${res.data.name} berhasil diperbarui!`,
          });
          onClose();
          reset();
        },
        onError: (error) => {
          let message = 'Gagal memperbarui profil. Silakan coba lagi.';
          if (isAxiosError(error)) {
            message =
              error.response?.data?.message ||
              'Gagal memperbarui profil. Silakan coba lagi.';
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui profil',
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
        <form onSubmit={handleSubmit(handleUpdateNameAndEmail)} className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              Perbarui Profil
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Ubah nama lengkap dan email akun Anda saat ini.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="dialog-name"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Nama Lengkap
              </Label>
              <Input
                id="dialog-name"
                {...register('name')}
                placeholder="Masukkan nama lengkap..."
                className="bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent"
                required
              />
              {errors.name && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="dialog-email"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Email
              </Label>
              <Input
                id="dialog-email"
                type="email"
                {...register('email')}
                placeholder="Masukkan email baru..."
                className="bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent"
              />
              {errors.email && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isPendingUpdateNameAndEmail}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPendingUpdateNameAndEmail}
              className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {isPendingUpdateNameAndEmail ? (
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
