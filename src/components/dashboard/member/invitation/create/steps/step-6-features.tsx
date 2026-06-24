import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TOGGLE_BENEFITS_DATA } from '@/constants/benefit.constant';
import { usePermission } from '@/hooks/use-permission';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { Lock } from 'lucide-react';
import {
  Controller,
  Path,
  useFormContext,
  useFormState,
} from 'react-hook-form';

export default function InvitationFeaturesStep() {
  const { register, control } =
    useFormContext<CreateUpdateInvitationFormValues>();
  const { errors } = useFormState({ control });
  const { can } = usePermission();

  return (
    <div className="space-y-8">
      <div className="border-border/40 border-b pb-4">
        <h3 className="text-foreground font-serif text-lg font-bold tracking-tight">
          Fitur & Media Tambahan
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Lengkapi undangan Anda dengan alunan musik, tautan live streaming,
          serta fitur-fitur interaktif lainnya.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground text-[11px] font-bold">
            Background Music (URL Audio){' '}
            <span className="text-muted-foreground font-normal">
              (Opsional)
            </span>
          </Label>
          <Input
            placeholder="Contoh: https://example.com/music.mp3"
            {...register('musicUrl')}
            className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
          />
          <p className="text-muted-foreground text-[10px]">
            Kosongkan jika tidak ingin menggunakan musik latar.
          </p>
          {errors.musicUrl && (
            <p className="text-destructive px-1 text-[10px] font-medium">
              {errors.musicUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-foreground text-[11px] font-bold">
            Live Streaming URL{' '}
            <span className="text-muted-foreground font-normal">
              (Opsional)
            </span>
          </Label>
          <Input
            placeholder="Contoh: https://youtube.com/live/..."
            {...register('liveStreamUrl')}
            className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
          />
          <p className="text-muted-foreground text-[10px]">
            Tautan YouTube/Zoom/IG Live untuk tamu yang tidak bisa hadir.
          </p>
          {errors.liveStreamUrl && (
            <p className="text-destructive px-1 text-[10px] font-medium">
              {errors.liveStreamUrl.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h4 className="text-primary border-border/40 border-b pb-1.5 font-serif text-sm font-bold">
          Pengaturan Fitur Interaktif
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TOGGLE_BENEFITS_DATA.map((feature) => {
            const isAllowed = can(feature.key);

            return (
              <div
                key={feature.key}
                className={`border-border/60 relative flex items-start gap-3 rounded-xl border p-4 shadow-sm transition-all ${
                  isAllowed
                    ? 'hover:bg-secondary/10'
                    : 'cursor-not-allowed overflow-hidden'
                }`}
              >
                {!isAllowed && (
                  <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-end pr-4 backdrop-blur-[1.5px]">
                    <span className="bg-primary/90 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wide text-white uppercase shadow-sm">
                      <Lock className="h-2.5 w-2.5" />
                      Upgrade Package
                    </span>
                  </div>
                )}

                <Controller
                  control={control}
                  name={
                    `enabledFeatures.${feature.key}` as Path<CreateUpdateInvitationFormValues>
                  }
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      id={feature.key}
                      checked={value as boolean}
                      onCheckedChange={onChange}
                      disabled={!isAllowed}
                      className="mt-0.5"
                    />
                  )}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={feature.key}
                    className="text-foreground cursor-pointer text-sm font-bold"
                  >
                    {feature.label}
                  </Label>
                  <p className="text-muted-foreground text-xs font-medium">
                    Aktifkan fitur {feature.label.toLowerCase()} pada halaman
                    undangan Anda.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
