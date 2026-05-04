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
import { Textarea } from '@/components/ui/textarea';
import { useUpdateBenefit } from '@/hooks/api/use-benefit';
import { useToast } from '@/hooks/use-toast';
import { Benefit } from '@/types/benefit/type';
import {
  CreateUpdateBenefitFormValues,
  createUpdateBenefitSchema,
} from '@/validations/admin/create-update-benefit';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2, Lock } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefit: Benefit;
}

export default function EditBenefitModal({
  isOpen,
  onClose,
  benefit,
}: EditBenefitModalProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUpdateBenefitFormValues>({
    resolver: zodResolver(createUpdateBenefitSchema),
    defaultValues: {
      name: '',
      key: undefined,
      description: '',
      type: 'toggle',
    },
  });

  useEffect(() => {
    if (benefit) {
      reset({
        name: benefit.name,
        key: benefit.key,
        description: benefit.description || '',
        type: benefit.type,
      });
    }
  }, [benefit, reset]);

  const updateMutation = useUpdateBenefit();

  const onSubmit = (data: CreateUpdateBenefitFormValues) => {
    updateMutation.mutate(
      { id: benefit.id, ...data },
      {
        onSuccess: (res) => {
          toast({
            title: 'Benefit diperbarui',
            variant: 'default',
            description: `Benefit ${res.data.name} berhasil diperbarui!`,
          });
          onClose();
        },
        onError: (error) => {
          let message = 'Gagal memperbarui benefit. Silakan coba lagi.';
          if (isAxiosError(error)) {
            message =
              error.response?.data?.message ||
              'Gagal memperbarui benefit. Silakan coba lagi.';
          }
          toast({
            variant: 'destructive',
            title: 'Gagal memperbarui benefit',
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
              Edit Benefit
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Perbarui konfigurasi fitur sistem yang sudah terdaftar.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Fungsi Sistem (Key)
              </Label>
              <div className="relative opacity-80">
                <Lock className="text-muted-foreground/30 absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2" />
                <Input
                  value={benefit.key}
                  readOnly
                  className="bg-secondary/20 border-border/60 text-primary-dark h-11 cursor-default border-dashed pl-10 font-mono text-[11px] tracking-tight italic"
                />
              </div>
              <p className="text-muted-foreground/60 px-1 text-[9px] italic">
                Identitas sistem tidak dapat diubah setelah dibuat.
              </p>
            </div>

            <hr className="border-border/40" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-name"
                  className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
                >
                  Nama Benefit
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Nama benefit..."
                  {...register('name')}
                  className={`bg-secondary/5 border-border/40 h-11 text-sm transition-all focus:bg-transparent ${errors.name ? 'border-destructive' : ''}`}
                />
                <p className="text-muted-foreground/60 px-1 text-[9px] italic">
                  Perbarui nama benefit yang memiliki makna sama dengan key
                </p>
                {errors.name && (
                  <p className="text-destructive text-[10px] font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  Tipe Data
                </Label>
                <div className="relative opacity-80">
                  <Lock className="text-muted-foreground/30 absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2" />
                  <Input
                    value={benefit.type}
                    readOnly
                    className="bg-secondary/10 border-border/60 text-primary-dark h-10 cursor-default border-dashed pl-10 text-xs italic"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-description"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Deskripsi
              </Label>
              <Textarea
                id="edit-description"
                placeholder="Apa kegunaan fitur ini?"
                {...register('description')}
                className={`bg-secondary/5 border-border/40 min-h-[100px] resize-none text-sm focus:bg-transparent ${errors.description ? 'border-destructive' : ''}`}
              />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {updateMutation.isPending ? (
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
