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
import { useCreateMember } from '@/hooks/api/use-member';
import { useGetPackages } from '@/hooks/api/use-package';
import { useToast } from '@/hooks/use-toast';
import {
  CreateUpdateMemberFormValues,
  createUpdateMemberSchema,
} from '@/validations/admin/create-update-member';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMemberModal({
  isOpen,
  onClose,
}: CreateMemberModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateUpdateMemberFormValues>({
    resolver: zodResolver(createUpdateMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      packageId: 0,
    },
  });

  const { data: packagesData, isLoading: isLoadingPackages } = useGetPackages({
    limit: 100,
  });
  const packages = packagesData?.items || [];

  const { mutate, isPending } = useCreateMember();

  const onSubmit = (data: CreateUpdateMemberFormValues) => {
    mutate(data, {
      onSuccess: (res) => {
        toast({
          title: 'Member berhasil ditambahkan',
          variant: 'default',
          description: `Member ${res.data.name} berhasil ditambahkan!`,
        });
        onClose();
        reset();
      },
      onError: (error) => {
        let message = 'Gagal menambahkan member. Silakan coba lagi.';
        if (isAxiosError(error)) {
          message =
            error.response?.data?.message ||
            'Gagal menambahkan member. Silakan coba lagi.';
        }
        toast({
          variant: 'destructive',
          title: 'Gagal menambahkan member',
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
              Member Baru
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Isi data berikut untuk mendaftarkan member baru.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Nama Member
              </Label>
              <Input
                id="name"
                placeholder="Masukkan nama member..."
                {...register('name')}
                className={`bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register('email')}
                className={`bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Pilih Paket
              </Label>
              <div className="relative">
                <Controller
                  name="packageId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ''}
                    >
                      <SelectTrigger
                        className={`bg-secondary/5 border-border/40 h-11 text-sm ${errors.packageId ? 'border-destructive' : ''}`}
                      >
                        <SelectValue
                          placeholder={
                            isLoadingPackages
                              ? 'Memuat paket...'
                              : 'Pilih paket...'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem
                            key={pkg.id}
                            value={String(pkg.id)}
                            className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                          >
                            {pkg.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.packageId && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.packageId.message}
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
