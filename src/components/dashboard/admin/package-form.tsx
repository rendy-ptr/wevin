'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useGetBenefits } from '@/hooks/api/use-benefit';
import {
  CreateUpdatePackageFormValues,
  createUpdatePackageSchema,
} from '@/validations/admin/create-update-package';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

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
      isActive: true,
      benefits: [],
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  const isActiveValue = useWatch({
    control,
    name: 'isActive',
  });

  const selectedBenefits =
    useWatch({
      control,
      name: 'benefits',
    }) || [];

  const priceValue =
    useWatch({
      control,
      name: 'price',
    }) || 0;

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
    return benefit ? benefit.value : '';
  };

  const handleBenefitValueChange = (benefitId: number, value: string) => {
    const index = selectedBenefits.findIndex(
      (b: { benefitId: number }) => b.benefitId === benefitId,
    );
    if (index > -1) {
      setValue(`benefits.${index}.value`, value);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/package">
            <Button
              variant="outline"
              size="icon"
              className="border-border/40 hover:bg-secondary/20 h-9 w-9 rounded-xl transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-foreground font-serif text-3xl font-bold tracking-tight">
            {title}
          </h1>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dark shadow-primary/20 h-11 px-8 text-xs font-bold tracking-wide uppercase shadow-lg transition-all active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Simpan Paket
        </Button>
      </div>

      <form className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card className="border-border/40 bg-background overflow-hidden rounded-2xl border shadow-sm">
            <CardHeader className="border-border/40 border-b px-6 py-5">
              <CardTitle className="text-foreground font-serif text-lg font-bold">
                Informasi Dasar
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Tentukan identitas utama dan harga untuk paket ini.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-7">
              <div className="space-y-2.5">
                <Label
                  htmlFor="name"
                  className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
                >
                  Nama Paket
                </Label>
                <Input
                  id="name"
                  placeholder="Contoh: Paket Premium, Paket Hemat..."
                  {...register('name')}
                  className={`bg-secondary/5 border-border/40 h-12 rounded-xl text-sm transition-all focus:bg-transparent ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && (
                  <p className="text-destructive text-[10px] font-medium">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="price"
                    className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
                  >
                    Harga (Rp)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    {...register('price', { valueAsNumber: true })}
                    className={`bg-secondary/5 border-border/40 h-12 rounded-xl text-sm transition-all focus:bg-transparent ${errors.price ? 'border-destructive' : ''}`}
                  />
                  {errors.price && (
                    <p className="text-destructive text-[10px] font-medium">
                      {errors.price.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2.5">
                  <Label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                    Status Paket
                  </Label>
                  <Select
                    value={isActiveValue ? 'true' : 'false'}
                    onValueChange={(val) =>
                      setValue('isActive', val === 'true')
                    }
                  >
                    <SelectTrigger className="bg-secondary/5 border-border/40 h-12 rounded-xl text-sm transition-all focus:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border shadow-xl">
                      <SelectItem value="true" className="rounded-lg">
                        Aktif
                      </SelectItem>
                      <SelectItem value="false" className="rounded-lg">
                        Non-aktif
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="description"
                  className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase"
                >
                  Deskripsi Singkat
                </Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan keunggulan paket ini..."
                  {...register('description')}
                  className="bg-secondary/5 border-border/40 min-h-[120px] rounded-xl text-sm transition-all focus:bg-transparent"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-background overflow-hidden rounded-2xl border shadow-sm">
            <CardHeader className="border-border/40 border-b px-6 py-5">
              <CardTitle className="text-foreground font-serif text-lg font-bold">
                Daftar Benefit & Fitur
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Pilih benefit yang tersedia dan tentukan nilai kuotanya.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-secondary/20 text-muted-foreground border-border/40 border-b text-[10px] font-bold tracking-widest uppercase">
                      <th className="w-20 px-6 py-4 text-center font-semibold">
                        Aktif
                      </th>
                      <th className="px-6 py-4 font-semibold">Nama Benefit</th>
                      <th className="px-6 py-4 font-semibold">Nilai / Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/40 divide-y">
                    {isLoadingBenefits ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center">
                          <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
                          <p className="text-muted-foreground mt-2 text-xs">
                            Memuat daftar benefit...
                          </p>
                        </td>
                      </tr>
                    ) : (
                      benefits.map((benefit) => {
                        const selected = isBenefitSelected(benefit.id);
                        return (
                          <motion.tr
                            key={benefit.id}
                            initial={false}
                            animate={{
                              backgroundColor: selected
                                ? 'var(--secondary-alpha-5)'
                                : 'transparent',
                            }}
                            className={`hover:bg-secondary/5 group transition-colors ${selected ? 'bg-secondary/5' : ''}`}
                          >
                            <td className="px-6 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleBenefit(benefit.id)}
                                className="border-border/40 text-primary focus:ring-primary/20 accent-primary h-4 w-4 rounded"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span
                                  className={`font-bold transition-colors ${selected ? 'text-primary' : 'text-foreground'}`}
                                >
                                  {benefit.name}
                                </span>
                                <span className="text-muted-foreground font-mono text-[10px] tracking-tighter uppercase">
                                  {benefit.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Input
                                placeholder={
                                  benefit.type === 'toggle'
                                    ? 'Contoh: Ya / Aktif'
                                    : 'Contoh: 100 Tamu'
                                }
                                value={getBenefitValue(benefit.id)}
                                disabled={!selected}
                                onChange={(e) =>
                                  handleBenefitValueChange(
                                    benefit.id,
                                    e.target.value,
                                  )
                                }
                                className={`border-border/40 h-10 rounded-lg text-xs transition-all ${
                                  selected
                                    ? 'bg-background shadow-sm'
                                    : 'bg-secondary/10 opacity-40'
                                }`}
                              />
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 bg-secondary/5 sticky top-8 rounded-2xl border shadow-sm">
            <CardContent className="p-7">
              <h3 className="text-foreground font-serif text-lg font-bold">
                Ringkasan Paket
              </h3>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Tinjauan konfigurasi paket sebelum dipublikasikan ke sistem.
              </p>
              <div className="border-border/40 mt-7 space-y-5 border-t pt-7">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Total Fitur
                  </span>
                  <span className="text-primary bg-primary/10 rounded-lg px-2.5 py-1 text-xs font-bold">
                    {selectedBenefits.length} Fitur
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Estimasi Harga
                  </span>
                  <span className="text-foreground text-sm font-bold">
                    {priceValue > 0
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(Number(priceValue))
                      : 'Rp 0'}
                  </span>
                </div>
              </div>

              <div className="bg-background/50 border-border/40 mt-8 rounded-xl border p-4">
                <p className="text-muted-foreground flex gap-2 text-[10px] leading-relaxed italic">
                  <Info className="h-3 w-3 shrink-0" />
                  Pastikan benefit yang dipilih sudah sesuai dengan target
                  market paket ini.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
