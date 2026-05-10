'use client';

import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/check';
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
import { API_URL } from '@/constants/url';
import { PACKAGE_STATUS, TPackageStatus } from '@/db/schema';
import { useGetBenefits } from '@/hooks/api/use-benefit';
import {
  formatCurrency,
  formatThousandSeparator,
  parseThousandSeparator,
} from '@/lib/currency';
import {
  CreateUpdatePackageFormValues,
  createUpdatePackageSchema,
} from '@/validations/admin/create-update-package';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';

interface PackageFormProps {
  initialData?: CreateUpdatePackageFormValues;
  onSubmit: (data: CreateUpdatePackageFormValues) => void;
  isLoading?: boolean;
  title: string;
}

export default function PackageForm({
  initialData,
  onSubmit,
  isLoading = false,
  title,
}: PackageFormProps) {
  const { data: benefitsData, isLoading: isLoadingBenefits } = useGetBenefits(
    undefined,
    undefined,
    1,
    100,
  );
  const benefits = benefitsData?.items || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateUpdatePackageFormValues>({
    resolver: zodResolver(createUpdatePackageSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      status: PACKAGE_STATUS.ACTIVE,
      benefits: [],
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  const statusValue = useWatch({ control, name: 'status' });
  const selectedBenefits = useWatch({ control, name: 'benefits' }) || [];
  const priceValue = useWatch({ control, name: 'price' }) || 0;
  const packageName = useWatch({ control, name: 'name' });
  const packageDesc = useWatch({ control, name: 'description' });

  const toggleBenefit = (benefitId: number) => {
    const index = selectedBenefits.findIndex(
      (b: { benefitId: number }) => b.benefitId === benefitId,
    );
    if (index > -1) {
      remove(index);
    } else {
      append({ benefitId, value: '' });
    }
  };

  const isBenefitSelected = (benefitId: number) => {
    return selectedBenefits.some(
      (b: { benefitId: number }) => b.benefitId === benefitId,
    );
  };

  const getBenefitValue = (benefitId: number) => {
    const benefit = selectedBenefits.find(
      (b: { benefitId: number }) => b.benefitId === benefitId,
    );
    return benefit ? (benefit.value ? benefit.value : '') : '';
  };

  const handleBenefitValueChange = (benefitId: number, value: string) => {
    const index = selectedBenefits.findIndex(
      (b: { benefitId: number }) => b.benefitId === benefitId,
    );
    if (index > -1) {
      setValue(`benefits.${index}.value`, value);
    }
  };

  const getBenefitName = (benefitId: number) => {
    return benefits.find((b) => b.id === benefitId)?.name || '';
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <main className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          <div className="space-y-12 lg:col-span-3">
            <div className="space-y-8">
              <div className="border-border/40 border-b pb-4">
                <div className="flex items-center gap-3">
                  <Link href={API_URL.PACKAGE.INDEX}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground h-10 w-10 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <div>
                    <h2 className="text-foreground font-serif text-xl font-bold tracking-tight">
                      {title}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Lengkapi informasi dasar paket layanan Anda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="space-y-2.5">
                  <Label className="text-foreground text-xs font-bold">
                    Nama Paket
                  </Label>
                  <Input
                    placeholder="Contoh: Royal Wedding Package"
                    {...register('name')}
                    className="border-border/60 focus:ring-primary/20 focus:border-primary h-12 rounded-xl bg-transparent px-4 text-sm shadow-sm transition-all focus:ring-2"
                  />
                  {errors.name && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label className="text-foreground text-xs font-bold">
                    Harga Paket (IDR)
                  </Label>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="relative">
                        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xs font-bold">
                          Rp
                        </span>
                        <Input
                          {...field}
                          value={formatThousandSeparator(value)}
                          onChange={(e) => {
                            const numericValue = parseThousandSeparator(
                              e.target.value,
                            );
                            onChange(numericValue);
                          }}
                          placeholder="0"
                          className="border-border/60 focus:ring-primary/20 focus:border-primary h-12 rounded-xl bg-transparent pr-4 pl-12 text-sm font-medium shadow-sm transition-all focus:ring-2"
                        />
                      </div>
                    )}
                  />
                  {errors.price && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.price.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2.5">
                  <Label className="text-foreground text-xs font-bold">
                    Status
                  </Label>
                  <Select
                    value={statusValue}
                    onValueChange={(val) =>
                      setValue('status', val as TPackageStatus)
                    }
                  >
                    <SelectTrigger className="border-border/60 h-12 rounded-xl bg-transparent px-4 text-sm shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border rounded-xl shadow-2xl">
                      <SelectItem
                        value={PACKAGE_STATUS.ACTIVE}
                        className="rounded-lg"
                      >
                        Aktif
                      </SelectItem>
                      <SelectItem
                        value={PACKAGE_STATUS.INACTIVE}
                        className="rounded-lg"
                      >
                        Tidak Aktif
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-foreground text-xs font-bold">
                    Deskripsi Paket
                  </Label>
                  <Textarea
                    placeholder="Jelaskan detail dan kelebihan paket ini..."
                    {...register('description')}
                    className="border-border/60 focus:ring-primary/20 focus:border-primary min-h-[120px] rounded-xl bg-transparent px-4 py-3 text-sm leading-relaxed shadow-sm transition-all focus:ring-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-4">
              <div className="border-border/40 border-b pb-4">
                <h2 className="text-foreground font-serif text-xl font-bold tracking-tight">
                  Fitur & Benefit
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Pilih dan tentukan kuota layanan untuk paket ini.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {isLoadingBenefits ? (
                  <div className="text-primary py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin opacity-20" />
                  </div>
                ) : (
                  benefits.map((benefit) => {
                    const selected = isBenefitSelected(benefit.id);
                    return (
                      <div
                        key={benefit.id}
                        className={`flex items-center gap-5 rounded-2xl border p-4 transition-all duration-300 ${
                          selected
                            ? 'bg-primary/[0.03] border-primary/30 shadow-sm'
                            : 'border-border/40 hover:border-border bg-transparent'
                        }`}
                      >
                        <div
                          onClick={() => toggleBenefit(benefit.id)}
                          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 transition-all ${
                            selected
                              ? 'bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-lg'
                              : 'bg-background border-border/60 hover:border-primary/40 text-transparent'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-grow">
                          <span
                            className={`block text-sm font-bold ${selected ? 'text-primary' : 'text-foreground'}`}
                          >
                            {benefit.name}
                          </span>
                          <span className="text-muted-foreground text-[10px] font-medium tracking-tighter uppercase">
                            {benefit.type}
                          </span>
                        </div>
                        <AnimatePresence>
                          {selected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="w-44"
                            >
                              <Input
                                placeholder="Nilai / Quota"
                                value={getBenefitValue(benefit.id)}
                                onChange={(e) =>
                                  handleBenefitValueChange(
                                    benefit.id,
                                    e.target.value,
                                  )
                                }
                                className="bg-background border-border/60 focus:ring-primary/10 h-10 rounded-xl text-xs shadow-inner focus:ring-2"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-6">
              <div className="text-center">
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">
                  Live Preview
                </span>
              </div>

              <div className="bg-card border-border ring-primary/5 relative flex flex-col rounded-2xl border p-10 shadow-sm ring-1 transition-all duration-300">
                <div className="mb-10 text-center">
                  <h3 className="text-foreground mb-3 font-serif text-3xl font-bold">
                    {packageName || 'Nama Paket'}
                  </h3>
                  <p className="text-muted-foreground mb-6 min-h-[40px] text-sm">
                    {packageDesc || 'Deskripsi paket akan muncul di sini...'}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-muted-foreground text-lg font-medium">
                      Rp
                    </span>
                    <span className="text-foreground font-serif text-5xl font-bold">
                      {priceValue > 0 ? formatCurrency(priceValue) : '0'}
                    </span>
                  </div>
                </div>

                <ul className="mb-10 flex-grow space-y-4">
                  {selectedBenefits.length > 0 ? (
                    selectedBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckIcon className="text-success mt-1 h-5 w-5 flex-shrink-0" />
                        <span className="text-foreground text-base leading-tight">
                          {b.value ? `${b.value} ` : ''}
                          {getBenefitName(b.benefitId)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-4 opacity-20">
                      <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0" />
                      <span className="text-base">
                        Belum ada fitur terpilih
                      </span>
                    </li>
                  )}
                </ul>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/10 w-full rounded-xl py-8 text-xl font-bold shadow-lg transition-all">
                  Pilih Paket
                </Button>

                <p className="text-muted-foreground mt-6 text-center text-[10px] italic">
                  * Tampilan pratinjau sesuai dengan landing page
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border/40 mt-12 flex items-center justify-end gap-3 border-t py-6">
          <Link href={API_URL.PACKAGE.INDEX}>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-11 px-6 text-xs font-semibold tracking-wide uppercase"
            >
              Batal
            </Button>
          </Link>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark h-11 px-6 text-white shadow-sm transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Simpan Paket
          </Button>
        </div>
      </main>
    </div>
  );
}
