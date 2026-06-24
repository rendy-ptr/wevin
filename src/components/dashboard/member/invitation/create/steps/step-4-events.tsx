import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimezoneEnum } from '@/enums/invitation.enum';
import { formatDate, formatToISODate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { CalendarIcon, MapPin, Plus, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  Controller,
  FieldError,
  useFieldArray,
  useFormContext,
  useFormState,
} from 'react-hook-form';

const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted/20 flex h-[350px] items-center justify-center rounded-xl border">
      Memuat Peta...
    </div>
  ),
});

export default function InvitationEventsStep() {
  const { register, control, setValue, clearErrors } =
    useFormContext<CreateUpdateInvitationFormValues>();

  const { errors } = useFormState({ control, name: 'events' });

  const eventsError = Array.isArray(errors.events)
    ? undefined
    : (errors.events as FieldError | undefined)?.message ||
      (errors.events as Record<string, FieldError> | undefined)?.root?.message;

  const [openMapIndex, setOpenMapIndex] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'events',
  });

  return (
    <div className="space-y-6">
      <div className="border-border/40 border-b pb-4">
        <h3 className="text-foreground font-serif text-lg font-bold tracking-tight">
          Jadwal & Lokasi Acara
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            ({fields.length} / 3)
          </span>
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Tambahkan detail acara seperti Akad Nikah, Resepsi, atau pemberkatan.
          Anda bisa menambahkan lebih dari satu acara.
        </p>
      </div>

      {fields.length === 0 && (
        <div className="border-border/40 flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center">
          <p className="text-muted-foreground mb-4 text-xs">
            Belum ada jadwal acara yang ditambahkan.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              clearErrors('events');
              append({
                title: '',
                date: '',
                time: '',
                timezone: TimezoneEnum.WIB,
                location: '',
                address: '',
                mapsUrl: '',
              });
            }}
            className="hover:bg-primary/5 hover:text-primary rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Acara Pertama
          </Button>
          {eventsError && (
            <p className="text-destructive mt-3 text-[10px] font-bold">
              {eventsError as string}
            </p>
          )}
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => {
          const eventErrors = (
            errors.events as unknown as Record<string, FieldError>[]
          )?.[index];
          return (
            <div
              key={field.id}
              className="border-border/60 bg-secondary/10 relative space-y-4 rounded-2xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold">
                  Acara #{index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-full"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-foreground text-[11px] font-bold">
                    Judul Acara (Misal: Akad / Resepsi){' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Contoh: Akad Nikah / Resepsi"
                    {...register(`events.${index}.title`)}
                    className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
                  />
                  {eventErrors?.title?.message && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {eventErrors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground text-[11px] font-bold">
                    Nama Lokasi / Gedung{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Contoh: Masjid Istiqlal"
                    {...register(`events.${index}.location`)}
                    className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
                  />
                  {eventErrors?.location?.message && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {eventErrors.location.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground text-[11px] font-bold">
                    Tanggal Acara <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name={`events.${index}.date`}
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
                              <span className="text-foreground">
                                {formatDate(field.value)}
                              </span>
                            ) : (
                              <span className="text-foreground">
                                Pilih Tanggal
                              </span>
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
                              field.onChange(date ? formatToISODate(date) : '');
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {eventErrors?.date?.message && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {eventErrors.date.message as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground text-[11px] font-bold">
                      Waktu Mulai <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="time"
                      {...register(`events.${index}.time`)}
                      className="border-border/60 focus:ring-primary/20 focus:border-primary block h-11 w-full rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
                    />
                    {eventErrors?.time?.message && (
                      <p className="text-destructive px-1 text-[10px] font-medium">
                        {eventErrors.time.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground text-[11px] font-bold">
                      Zona Waktu <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name={`events.${index}.timezone`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="border-border/60 focus:ring-primary/20 focus:border-primary !h-11 w-full rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2">
                            <SelectValue placeholder="Zona" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(TimezoneEnum).map((tz) => (
                              <SelectItem
                                key={tz}
                                value={tz}
                                className="hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
                              >
                                {tz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-foreground text-[11px] font-bold">
                    Alamat Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Contoh: Jl. Taman Wijaya Kusuma, Jakarta Pusat"
                    {...register(`events.${index}.address`)}
                    className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
                  />
                  {eventErrors?.address?.message && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {eventErrors.address.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-foreground text-[11px] font-bold">
                    Link Google Maps{' '}
                    <span className="text-muted-foreground font-normal">
                      (Opsional)
                    </span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Contoh: https://maps.app.goo.gl/..."
                      {...register(`events.${index}.mapsUrl`)}
                      disabled
                      className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 flex-1 cursor-not-allowed rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenMapIndex(index)}
                      className="hover:bg-primary/10 hover:text-primary-dark h-11 shrink-0 cursor-pointer rounded-xl transition-colors"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Pilih di Peta
                    </Button>
                  </div>
                  {eventErrors?.mapsUrl?.message && (
                    <p className="text-destructive px-1 text-[10px] font-medium">
                      {eventErrors.mapsUrl.message as string}
                    </p>
                  )}

                  <Dialog
                    open={openMapIndex === index}
                    onOpenChange={(isOpen) => !isOpen && setOpenMapIndex(null)}
                  >
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>
                          Pilih Titik Lokasi Google Maps
                        </DialogTitle>
                      </DialogHeader>
                      <MapPicker
                        onClose={() => setOpenMapIndex(null)}
                        onLocationSelect={(url) => {
                          setValue(`events.${index}.mapsUrl`, url, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fields.length > 0 && fields.length < 3 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            clearErrors('events');
            append({
              title: '',
              date: '',
              time: '',
              timezone: TimezoneEnum.WIB,
              location: '',
              address: '',
              mapsUrl: '',
            });
          }}
          className="hover:bg-primary/5 hover:text-primary mt-4 w-full rounded-xl border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Acara Lainnya
        </Button>
      )}
    </div>
  );
}
