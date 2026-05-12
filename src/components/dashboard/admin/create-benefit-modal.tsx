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
import { Textarea } from '@/components/ui/textarea';
import {
  BENEFIT_TYPE_LABELS,
  SYSTEM_ACTION_LABELS,
  SYSTEM_ACTION_TYPES,
  SystemAction,
} from '@/constants/benefits';
import { useCreateBenefit } from '@/hooks/api/use-benefit';
import { useToast } from '@/hooks/use-toast';
import {
  CreateUpdateBenefitFormValues,
  createUpdateBenefitSchema,
} from '@/validations/admin/create-update-benefit';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Loader2, Lock } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';

interface CreateBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateBenefitModal({
  isOpen,
  onClose,
}: CreateBenefitModalProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
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

  const selectedType = useWatch({
    control,
    name: 'type',
  });

  const createMutation = useCreateBenefit();

  const onSubmit = (data: CreateUpdateBenefitFormValues) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        toast({
          title: 'Benefit berhasil ditambahkan',
          variant: 'default',
          description: `Benefit ${res.data.name} berhasil ditambahkan!`,
        });
        onClose();
        reset();
      },
      onError: (error) => {
        let message = 'Gagal menambahkan benefit. Silakan coba lagi.';
        if (isAxiosError(error)) {
          message =
            error.response?.data?.message ||
            'Gagal menambahkan benefit. Silakan coba lagi.';
        }
        toast({
          variant: 'destructive',
          title: 'Gagal menambahkan benefit',
          description: message,
        });
      },
    });
  };

  const handleKeyChange = (val: SystemAction) => {
    setValue('key', val, { shouldValidate: true });

    const type = SYSTEM_ACTION_TYPES[val];
    if (type) setValue('type', type, { shouldValidate: true });

    const label = SYSTEM_ACTION_LABELS[val];
    if (label) setValue('name', label, { shouldValidate: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-background overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-[420px]">
        <form onSubmit={handleSubmit(onSubmit)} className="p-7">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-foreground font-serif text-xl font-bold tracking-tight">
              Benefit Baru
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5 text-xs">
              Pilih fungsi sistem dan tentukan identitas benefitnya.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Fungsi Sistem (Key)
              </Label>
              <div className="relative">
                <Controller
                  name="key"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={handleKeyChange} value={field.value}>
                      <SelectTrigger
                        className={`bg-secondary/5 border-border/40 h-11 font-mono text-sm ${errors.key ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder="Pilih System Action..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SYSTEM_ACTION_LABELS).map(
                          ([action, label]) => (
                            <SelectItem
                              key={action}
                              value={action}
                              className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                            >
                              <span className="mr-2 font-mono text-[10px] opacity-50">
                                [{action}]
                              </span>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.key && (
                <p className="text-destructive text-[10px] font-medium">
                  {errors.key.message}
                </p>
              )}
            </div>

            <hr className="border-border/40" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
                >
                  Nama Benefit
                </Label>
                <Input
                  id="name"
                  placeholder="Nama benefit..."
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
                <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  Tipe Benefit
                </Label>
                <div className="relative opacity-80">
                  <Lock className="text-muted-foreground/30 absolute top-1/2 left-3.5 z-10 h-3.5 w-3.5 -translate-y-1/2" />
                  <Input
                    value={BENEFIT_TYPE_LABELS[selectedType] || ''}
                    readOnly
                    placeholder="Pilih key untuk menentukan tipe..."
                    className="bg-secondary/10 border-border/60 text-primary-dark h-10 cursor-default border-dashed pl-10 text-xs italic"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
              >
                Deskripsi
              </Label>
              <Textarea
                id="description"
                placeholder="Apa kegunaan fitur ini?"
                {...register('description')}
                className={`bg-secondary/5 border-border/40 min-h-[80px] resize-none text-sm focus:bg-transparent ${errors.description ? 'border-destructive' : ''}`}
              />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-primary hover:bg-primary-dark shadow-primary/20 relative h-11 px-10 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
            >
              {createMutation.isPending ? (
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
