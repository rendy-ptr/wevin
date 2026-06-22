import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CheckIcon } from '@/components/ui/check';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { TOGGLE_BENEFITS_DATA } from '@/constants/benefit.constant';
import { usePermission } from '@/hooks/use-permission';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { CalendarIcon, Eye, MapPin, Plus, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted/20 flex h-[350px] items-center justify-center rounded-xl border">
      Memuat Peta...
    </div>
  ),
});

import {
  Controller,
  FieldErrors,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';

interface InvitationFeaturesStepProps {
  errors?: FieldErrors;
}

export default function InvitationFeaturesStep({
  errors: propErrors,
}: InvitationFeaturesStepProps) {
  const {
    register,
    control,
    watch,
    getValues,
    formState: { errors: contextErrors },
    setValue,
  } = useFormContext();

  const errors = propErrors || contextErrors;

  const { can, getQuota } = usePermission();

  const ownedToggleBenefits = TOGGLE_BENEFITS_DATA.filter((benefit) =>
    can(benefit.key),
  );

  const photoLimit = getQuota('photo_limit');
  const canHaveGallery = photoLimit > 0;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gallery',
  });

  const eventDate = useWatch({ control, name: 'eventDate' });
  const currentAkadDate = useWatch({ control, name: 'akadDate' });
  const currentResepsiDate = useWatch({ control, name: 'resepsiDate' });

  const groomName = useWatch({ control, name: 'groomName' });
  const brideName = useWatch({ control, name: 'brideName' });
  const placement = useWatch({ control, name: 'placement' });

  const galleryValues = watch('gallery') || [];

  const [isAkadMapOpen, setIsAkadMapOpen] = useState(false);
  const [isResepsiMapOpen, setIsResepsiMapOpen] = useState(false);

  useEffect(() => {
    if (eventDate) {
      if (!currentAkadDate) setValue('akadDate', eventDate);
      if (!currentResepsiDate) setValue('resepsiDate', eventDate);
    }
  }, [eventDate, currentAkadDate, currentResepsiDate, setValue]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-foreground font-serif text-xl font-bold tracking-tight">
            Isi Konten & Fitur Undangan
          </h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Lengkapi data diri, jadwal acara, dan fitur tambahan (jika paket
            Anda mendukung).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-primary/20 text-primary hover:bg-primary hover:text-white"
          onClick={() => {
            const data = getValues();
            localStorage.setItem(
              'wevin_invitation_preview',
              JSON.stringify(data),
            );
            window.open('/invitation/preview', '_blank');
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          Lihat Preview
        </Button>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {/* SECTION PEMBUKA */}
        <AccordionItem
          value="pembuka"
          className="border-border/60 hover:bg-secondary/5 rounded-2xl border bg-transparent px-5 py-2 transition-colors duration-200"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold">Section Pembuka</span>
              <span className="text-muted-foreground text-xs font-normal">
                Salam, kata pengantar, dan identitas mempelai.
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Salam Pembuka</Label>
                <Textarea {...register('openingGreeting')} />
                {errors.openingGreeting && (
                  <p className="text-destructive px-1 text-[10px] font-medium">
                    {errors.openingGreeting.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Pesan Pembuka</Label>
                <Textarea {...register('openingMessage')} />
                {errors.openingMessage && (
                  <p className="text-destructive px-1 text-[10px] font-medium">
                    {errors.openingMessage.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-4 font-serif text-sm font-bold">
                Mempelai Pria
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input
                    {...register('groomFullName')}
                    placeholder={`Misal: ${groomName || 'Budi'} Santoso, S.T.`}
                  />
                  {errors.groomFullName && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.groomFullName.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nama Orang Tua</Label>
                  <Input
                    {...register('groomParents')}
                    placeholder="Bapak Joko & Ibu Sri"
                  />
                  {errors.groomParents && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.groomParents.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-4 font-serif text-sm font-bold">
                Mempelai Wanita
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input
                    {...register('brideFullName')}
                    placeholder={`Misal: ${brideName || 'Wati'} Setiawati, S.E.`}
                  />
                  {errors.brideFullName && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.brideFullName.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nama Orang Tua</Label>
                  <Input
                    {...register('brideParents')}
                    placeholder="Bapak Hadi & Ibu Dewi"
                  />
                  {errors.brideParents && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.brideParents.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="acara"
          className="border-border/60 hover:bg-secondary/5 rounded-2xl border bg-transparent px-5 py-2 transition-colors duration-200"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold">Section Acara</span>
              <span className="text-muted-foreground text-xs font-normal">
                Waktu dan tempat pelaksanaan Akad & Resepsi.
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div>
              <h4 className="text-primary mb-4 font-serif text-sm font-bold">
                Akad Nikah
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Controller
                    name="akadDate"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'border-border/60 focus:border-primary focus:ring-primary/20 h-11 w-full justify-start rounded-xl bg-transparent px-4 text-left font-normal shadow-sm transition-all hover:bg-transparent focus:ring-2',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Pilih Tanggal Akad</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const yyyy = date.getFullYear();
                                const mm = String(date.getMonth() + 1).padStart(
                                  2,
                                  '0',
                                );
                                const dd = String(date.getDate()).padStart(
                                  2,
                                  '0',
                                );
                                field.onChange(`${yyyy}-${mm}-${dd}`);
                              } else {
                                field.onChange('');
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.akadDate && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.akadDate.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Waktu</Label>
                  <Input
                    type="time"
                    {...register('akadTime')}
                    className="h-11 rounded-xl"
                  />
                  {errors.akadTime && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.akadTime.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nama Lokasi / Tempat</Label>
                  <Input
                    {...register('akadLocation')}
                    placeholder={`Misal: ${placement || 'Masjid Al-Ikhlas'} - Lt. 1`}
                  />
                  {errors.akadLocation && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.akadLocation.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Alamat Lengkap</Label>
                  <Input {...register('akadAddress')} />
                  {errors.akadAddress && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.akadAddress.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Link Google Maps</Label>
                  <div className="flex gap-2">
                    <Input
                      {...register('akadMapsUrl')}
                      placeholder="https://maps.google.com/..."
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAkadMapOpen(true)}
                      className="hover:bg-primary/10 hover:text-primary-dark shrink-0 cursor-pointer transition-colors"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Pilih Titik
                    </Button>
                  </div>
                  {errors.akadMapsUrl && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.akadMapsUrl.message as string}
                    </p>
                  )}

                  <Dialog open={isAkadMapOpen} onOpenChange={setIsAkadMapOpen}>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Pilih Titik Lokasi Akad</DialogTitle>
                      </DialogHeader>
                      <MapPicker
                        onClose={() => setIsAkadMapOpen(false)}
                        onLocationSelect={(url) => {
                          setValue('akadMapsUrl', url, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-primary mb-4 font-serif text-sm font-bold">
                Resepsi
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Controller
                    name="resepsiDate"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'border-border/60 focus:border-primary focus:ring-primary/20 h-11 w-full justify-start rounded-xl bg-transparent px-4 text-left font-normal shadow-sm transition-all hover:bg-transparent focus:ring-2',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Pilih Tanggal Resepsi</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const yyyy = date.getFullYear();
                                const mm = String(date.getMonth() + 1).padStart(
                                  2,
                                  '0',
                                );
                                const dd = String(date.getDate()).padStart(
                                  2,
                                  '0',
                                );
                                field.onChange(`${yyyy}-${mm}-${dd}`);
                              } else {
                                field.onChange('');
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.resepsiDate && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.resepsiDate.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Waktu</Label>
                  <Input
                    type="time"
                    {...register('resepsiTime')}
                    className="h-11 rounded-xl"
                  />
                  {errors.resepsiTime && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.resepsiTime.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nama Lokasi / Tempat</Label>
                  <Input
                    {...register('resepsiLocation')}
                    placeholder={`Misal: ${placement || 'Hotel Grand Ballroom'} - Utama`}
                  />
                  {errors.resepsiLocation && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.resepsiLocation.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Alamat Lengkap</Label>
                  <Input {...register('resepsiAddress')} />
                  {errors.resepsiAddress && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.resepsiAddress.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Link Google Maps</Label>
                  <div className="flex gap-2">
                    <Input
                      {...register('resepsiMapsUrl')}
                      placeholder="https://maps.google.com/..."
                      readOnly
                      className="bg-muted/50 cursor-not-allowed"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsResepsiMapOpen(true)}
                      className="hover:bg-primary/10 hover:text-primary-dark shrink-0 cursor-pointer transition-colors"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Pilih Titik
                    </Button>
                  </div>
                  {errors.resepsiMapsUrl && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {errors.resepsiMapsUrl.message as string}
                    </p>
                  )}

                  <Dialog
                    open={isResepsiMapOpen}
                    onOpenChange={setIsResepsiMapOpen}
                  >
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Pilih Titik Lokasi Resepsi</DialogTitle>
                      </DialogHeader>
                      <MapPicker
                        onClose={() => setIsResepsiMapOpen(false)}
                        onLocationSelect={(url) => {
                          setValue('resepsiMapsUrl', url, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="penutup"
          className="border-border/60 hover:bg-secondary/5 rounded-2xl border bg-transparent px-5 py-2 transition-colors duration-200"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold">Section Penutup</span>
              <span className="text-muted-foreground text-xs font-normal">
                Pesan penutup dan ucapan terima kasih.
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label>Pesan Kehormatan</Label>
              <Textarea
                {...register('closingMessage')}
                className="min-h-[80px]"
              />
              {errors.closingMessage && (
                <p className="text-destructive px-1 text-[10px] font-medium">
                  {errors.closingMessage.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Ucapan Terima Kasih</Label>
              <Input {...register('closingGreeting')} />
              {errors.closingGreeting && (
                <p className="text-destructive px-1 text-[10px] font-medium">
                  {errors.closingGreeting.message as string}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="fitur"
          className="border-border/60 hover:bg-secondary/5 rounded-2xl border bg-transparent px-5 py-2 transition-colors duration-200"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col text-left">
              <span className="text-primary font-serif font-bold">
                Section Benefit & Fitur Tambahan
              </span>
              <span className="text-muted-foreground text-xs font-normal">
                RSVP, Galeri Foto, Music, Live Streaming (jika ada).
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4">
            {ownedToggleBenefits.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {ownedToggleBenefits.map((benefit) => (
                  <Controller
                    key={benefit.key}
                    name={`enabledFeatures.${benefit.key}`}
                    control={control}
                    render={({ field }) => {
                      const isEnabled = !!field.value;
                      return (
                        <div className="space-y-3">
                          <div
                            onClick={() => field.onChange(!isEnabled)}
                            className={`flex cursor-pointer items-center gap-5 rounded-xl border p-3 transition-all duration-300 ${
                              isEnabled
                                ? 'bg-primary/[0.03] border-primary/30 shadow-sm'
                                : 'border-border/40 hover:border-border bg-transparent'
                            }`}
                          >
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                                isEnabled
                                  ? 'bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-md'
                                  : 'bg-background border-border/60 hover:border-primary/40 text-transparent'
                              }`}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-grow">
                              <span
                                className={`block text-sm font-bold ${isEnabled ? 'text-primary' : 'text-foreground'}`}
                              >
                                {benefit.label}
                              </span>
                            </div>
                          </div>

                          {isEnabled && benefit.key === 'music_player' && (
                            <div className="animate-in fade-in-50 py-2 pr-4 pl-12 duration-200">
                              <Label className="text-foreground mb-1.5 block text-xs font-bold">
                                URL Musik (MP3 / Youtube)
                              </Label>
                              <Input
                                placeholder="https://..."
                                {...register('musicUrl')}
                                className="text-xs"
                              />
                            </div>
                          )}

                          {isEnabled && benefit.key === 'live_streaming' && (
                            <div className="animate-in fade-in-50 py-2 pr-4 pl-12 duration-200">
                              <Label className="text-foreground mb-1.5 block text-xs font-bold">
                                Link Live Streaming
                              </Label>
                              <Input
                                placeholder="Contoh: https://youtube.com/live/..."
                                {...register('liveStreamUrl')}
                                className="text-xs"
                              />
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                ))}
              </div>
            )}

            {/* GALLERY BENEFIT */}
            {canHaveGallery && (
              <div className="border-border/40 mt-6 border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-foreground font-serif text-sm font-bold">
                      Galeri Foto
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Batas upload: {photoLimit} foto
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => append({ imageUrl: '' })}
                    disabled={galleryValues.length >= photoLimit}
                    size="sm"
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary h-8 rounded-lg text-xs hover:text-white"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Tambah Foto
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border-border/40 bg-card flex items-center gap-2 rounded-xl border p-2 shadow-sm"
                    >
                      <Input
                        placeholder="https://..."
                        {...register(`gallery.${index}.imageUrl` as const)}
                        className="h-9 border-none bg-transparent text-xs shadow-none focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 shrink-0 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <div className="border-border/60 bg-muted/20 col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed py-8">
                      <p className="text-muted-foreground text-xs">
                        Belum ada foto. Klik &quot;Tambah Foto&quot; untuk
                        memulai.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
