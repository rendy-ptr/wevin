'use client';

import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/check';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LayersIcon } from '@/components/ui/layers';
import { Textarea } from '@/components/ui/textarea';
import { BENEFITS_DATA } from '@/constants/benefit.constant';
import { API_URL } from '@/constants/url';
import { useGetTemplates } from '@/hooks/api/use-template';
import {
  formatCurrency,
  formatThousandSeparator,
  parseThousandSeparator,
} from '@/lib/currency';
import { BenefitKeyType } from '@/types/benefit.type';
import { TTemplate } from '@/types/template.type';
import {
  CreateUpdatePackageFormValues,
  createUpdatePackageSchema,
} from '@/validations/admin/create-update-package';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
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
  const { data: templatesData = [], isLoading: isLoadingTemplates } =
    useGetTemplates();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateUpdatePackageFormValues>({
    resolver: zodResolver(createUpdatePackageSchema),
    defaultValues: initialData ?? {
      name: '',
      description: '',
      price: 0,
      isPopular: false,
      isActive: false,
      benefits: [],
      templateIds: [],
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  const selectedBenefits = useWatch({ control, name: 'benefits' }) || [];
  const selectedTemplateIds = useWatch({ control, name: 'templateIds' });
  const priceValue = useWatch({ control, name: 'price' }) || 0;
  const packageName = useWatch({ control, name: 'name' });
  const packageDesc = useWatch({ control, name: 'description' });

  useEffect(() => {
    if (templatesData && templatesData.length > 0) {
      const systemClassic = templatesData.find(
        (t: TTemplate) => t.name.toLowerCase() === 'system classic',
      );
      if (systemClassic && !selectedTemplateIds.includes(systemClassic.id)) {
        setValue('templateIds', [...selectedTemplateIds, systemClassic.id]);
      }
    }
  }, [templatesData, selectedTemplateIds, setValue]);

  const toggleBenefit = (key: BenefitKeyType) => {
    const benefit = BENEFITS_DATA.find((b) => b.key === key);
    const index = selectedBenefits.findIndex((b) => b.benefitKey === key);

    if (index > -1) {
      remove(index);
    } else {
      append(
        benefit?.type === 'toggle'
          ? { benefitKey: key, toggleValue: true, quotaValue: undefined }
          : { benefitKey: key, toggleValue: undefined, quotaValue: 0 },
      );
    }
  };

  const isBenefitSelected = (key: BenefitKeyType) => {
    return selectedBenefits.some((b) => b.benefitKey === key);
  };

  const getQuotaValue = (key: BenefitKeyType) => {
    const benefit = selectedBenefits.find((b) => b.benefitKey === key);
    return benefit?.quotaValue ?? 0;
  };

  const handleQuotaChange = (key: BenefitKeyType, raw: string) => {
    const index = selectedBenefits.findIndex((b) => b.benefitKey === key);
    if (index === -1) return;
    const parsed = parseInt(raw, 10);
    setValue(`benefits.${index}.quotaValue`, isNaN(parsed) ? 0 : parsed);
  };

  const isTemplateSelected = (templateId: number) => {
    return selectedTemplateIds.includes(templateId);
  };

  const toggleTemplate = (templateId: number) => {
    const template = templatesData.find((t) => t.id === templateId);
    if (template?.name.toLowerCase() === 'system classic') return;

    const next = isTemplateSelected(templateId)
      ? selectedTemplateIds.filter((id) => id !== templateId)
      : [...selectedTemplateIds, templateId];
    setValue('templateIds', next);
  };

  const getTemplateName = (templateId: number) => {
    return (
      templatesData.find((t: TTemplate) => t.id === templateId)?.name ?? ''
    );
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
                <div className="flex items-center gap-3">
                  <div className="border-border/60 flex items-start gap-3 rounded-xl border p-4 shadow-sm">
                    <Controller
                      control={control}
                      name="isActive"
                      render={({ field }) => (
                        <Checkbox
                          id="isActive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="isActive"
                        className="text-foreground cursor-pointer text-sm font-bold"
                      >
                        Paket Aktif
                      </Label>
                      <p className="text-muted-foreground text-xs font-medium">
                        Paket ini hanya akan muncul pada halaman depan jika
                        paket ini aktif
                      </p>
                    </div>
                  </div>
                  <div className="border-border/60 flex items-start gap-3 rounded-xl border p-4 shadow-sm">
                    <Controller
                      control={control}
                      name="isPopular"
                      render={({ field }) => (
                        <Checkbox
                          id="isPopular"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="isPopular"
                        className="text-foreground cursor-pointer text-sm font-bold"
                      >
                        Paket Populer (Terlaris)
                      </Label>
                      <p className="text-muted-foreground text-xs font-medium">
                        Tampilkan lencana &quot;Terlaris&quot; pada paket ini di
                        halaman depan.
                      </p>
                    </div>
                  </div>
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
                  {errors.description && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.description.message as string}
                    </p>
                  )}
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
                {BENEFITS_DATA.map((benefit, index) => {
                  const selected = isBenefitSelected(benefit.key);
                  return (
                    <div
                      key={`${benefit.key}-${index}`}
                      className={`flex items-center gap-5 rounded-2xl border p-4 transition-all duration-300 ${
                        selected
                          ? 'bg-primary/[0.03] border-primary/30 shadow-sm'
                          : 'border-border/40 hover:border-border bg-transparent'
                      }`}
                    >
                      <div
                        onClick={() => toggleBenefit(benefit.key)}
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
                          {benefit.label}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-medium tracking-tighter uppercase">
                          {benefit.key} • {benefit.type}
                        </span>
                      </div>
                      <AnimatePresence>
                        {selected && benefit.type === 'quota' && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-44"
                          >
                            <Input
                              placeholder="Nilai / Quota"
                              value={getQuotaValue(benefit.key)}
                              onChange={(e) =>
                                handleQuotaChange(benefit.key, e.target.value)
                              }
                              className="bg-background border-border/60 focus:ring-primary/10 h-10 rounded-xl text-xs shadow-inner focus:ring-2"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-8 pt-4">
                <div className="border-border/40 border-b pb-4">
                  <h2 className="text-foreground font-serif text-xl font-bold tracking-tight">
                    Pilihan Template
                  </h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Pilih desain template yang tersedia untuk paket ini.
                  </p>
                  {errors.templateIds && (
                    <p className="text-destructive mt-1 px-1 text-[10px] font-medium">
                      {errors.templateIds.message as string}
                    </p>
                  )}
                </div>

                {isLoadingTemplates ? (
                  <div className="text-primary py-10 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin opacity-20" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {templatesData.map((template: TTemplate, index: number) => {
                      const isSystemClassic =
                        template.name.toLowerCase() === 'system classic';
                      const selected = isSystemClassic
                        ? true
                        : isTemplateSelected(template.id);
                      return (
                        <div
                          key={`${template.id}-${index}`}
                          onClick={() => {
                            if (!isSystemClassic) {
                              toggleTemplate(template.id);
                            }
                          }}
                          className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                            isSystemClassic
                              ? 'bg-primary/[0.02] border-primary/20 cursor-not-allowed opacity-75'
                              : 'cursor-pointer'
                          } ${
                            selected && !isSystemClassic
                              ? 'bg-primary/[0.03] border-primary/40 ring-primary/20 shadow-md ring-1'
                              : !selected
                                ? 'border-border/40 hover:border-primary/20 bg-transparent'
                                : ''
                          }`}
                        >
                          <div
                            className={`aspect-[4/3] w-full ${template.thumbnail || 'bg-secondary/20'} transition-transform duration-500 group-hover:scale-105`}
                          />
                          <div className="flex items-center justify-between p-4">
                            <span
                              className={`text-sm font-bold ${selected ? 'text-primary' : 'text-foreground'}`}
                            >
                              {template.name}
                            </span>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                                selected
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'bg-background border-border/60 text-transparent'
                              }`}
                            >
                              <CheckIcon className="h-3.5 w-3.5" />
                            </div>
                          </div>
                          {isSystemClassic && (
                            <div className="bg-muted-foreground/20 text-muted-foreground absolute top-3 right-3 rounded-full px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase">
                              Default
                            </div>
                          )}
                          {selected && !isSystemClassic && (
                            <div className="bg-primary absolute top-3 right-3 rounded-full px-2 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase shadow-lg">
                              Selected
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
                    selectedBenefits.map((b, index) => {
                      const def = BENEFITS_DATA.find(
                        (d) => d.key === b.benefitKey,
                      );
                      return (
                        <li key={index} className="flex items-start gap-4">
                          <CheckIcon className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                          <span className="text-foreground text-base leading-tight">
                            {def?.type === 'quota' ? `${b.quotaValue} ` : ''}
                            {def?.label ?? b.benefitKey}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="flex items-start gap-4 opacity-20">
                      <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0" />
                      <span className="text-base">
                        Belum ada fitur terpilih
                      </span>
                    </li>
                  )}

                  {selectedTemplateIds.length > 0 && (
                    <li className="border-border/60 flex items-start gap-4">
                      <LayersIcon className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                      <span className="text-foreground text-base leading-tight">
                        {selectedTemplateIds.length} Template (
                        {selectedTemplateIds
                          .map((id) => getTemplateName(id))
                          .join(', ')}
                        )
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
            onClick={handleSubmit(onSubmit, (errors) => {
              console.log('Form validation errors:', errors);
            })}
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
