import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, FieldErrors, useFormContext } from 'react-hook-form';

interface InvitationBookStepProps {
  errors?: FieldErrors;
}

export default function InvitationBookStep({
  errors: propErrors,
}: InvitationBookStepProps) {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors: contextErrors },
  } = useFormContext();

  const errors = propErrors || contextErrors;

  const groomName = watch('groomName') || '';
  const brideName = watch('brideName') || '';

  useEffect(() => {
    if (groomName && brideName) {
      setValue('name', `Pernikahan ${groomName} & ${brideName}`, {
        shouldValidate: true,
      });

      const generatedSlug = `${groomName}-${brideName}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [groomName, brideName, setValue]);

  return (
    <div className="grid gap-6">
      <div className="space-y-4">
        <h3 className="text-primary border-border/40 border-b pb-1.5 font-serif text-sm font-bold">
          Nama Kedua Mempelai
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Mempelai Pria (Nama Panggilan)
            </Label>
            <Input
              placeholder="Contoh: Budi"
              {...register('groomName')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.groomName && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.groomName.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Mempelai Wanita (Nama Panggilan)
            </Label>
            <Input
              placeholder="Contoh: Ani"
              {...register('brideName')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.brideName && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.brideName.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="text-primary border-border/40 border-b pb-1.5 font-serif text-sm font-bold">
          Waktu & Lokasi Sampul
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Tanggal Utama Acara
            </Label>
            <Controller
              control={control}
              name="eventDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'border-border/60 focus:border-primary focus:ring-primary/20 h-11 w-full justify-start rounded-xl bg-transparent px-4 text-left text-xs font-normal shadow-sm transition-all hover:bg-transparent focus:ring-2',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pilih Tanggal Acara</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const yyyy = date.getFullYear();
                          const mm = String(date.getMonth() + 1).padStart(
                            2,
                            '0',
                          );
                          const dd = String(date.getDate()).padStart(2, '0');
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
            {errors.eventDate && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.eventDate.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Lokasi Acara Singkat (untuk Cover)
            </Label>
            <Input
              placeholder="Contoh: Hotel Grand Ballroom, Jakarta"
              {...register('placement')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.placement && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.placement.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: TEXT CUSTOMIZATION */}
      <div className="space-y-4 pt-2">
        <h3 className="text-primary border-border/40 border-b pb-1.5 font-serif text-sm font-bold">
          Kustomisasi Teks Sampul
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Teks Pengantar (Pre-heading)
            </Label>
            <Input
              placeholder="Contoh: The Wedding of, Walimatul Ursy"
              {...register('prefixTitle')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.prefixTitle && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.prefixTitle.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Salam Sampul (Greeting)
            </Label>
            <Input
              placeholder="Contoh: With Love,"
              {...register('coverGreeting')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.coverGreeting && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.coverGreeting.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground text-[11px] font-bold">
            Kutipan / Ayat Sampul (Quote)
          </Label>
          <Textarea
            placeholder='Contoh: "Two souls with but a single thought, two hearts that beat as one."'
            {...register('coverQuote')}
            className="border-border/60 focus:ring-primary/20 focus:border-primary min-h-[70px] rounded-xl bg-transparent px-4 py-2 text-xs shadow-sm transition-all focus:ring-2"
          />
          {errors.coverQuote && (
            <p className="text-destructive px-1 text-[10px] font-medium">
              {errors.coverQuote.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
