import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext, useFormState } from 'react-hook-form';

import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';

export default function InvitationProfilesStep() {
  const { register, control } =
    useFormContext<CreateUpdateInvitationFormValues>();
  const { errors } = useFormState({ control });

  return (
    <div className="space-y-8">
      <div className="border-border/40 border-b pb-4">
        <h3 className="text-foreground font-serif text-lg font-bold tracking-tight">
          Data Identitas Mempelai
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Lengkapi data diri masing-masing mempelai untuk ditampilkan pada
          undangan.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-primary border-border/40 border-b pb-1.5 font-serif text-sm font-bold">
          Mempelai Pria
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Panggilan <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Contoh: Budi"
              {...register('groomName')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.groomName?.message && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.groomName.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Lengkap & Gelar <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Contoh: Budi Santoso, S.T."
              {...register('groomFullName')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.groomFullName?.message && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.groomFullName.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Orang Tua <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Contoh: Putra dari Bapak Joko & Ibu Sri"
              {...register('groomParents')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.groomParents?.message && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.groomParents.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h4 className="text-primary border-border/40 border-b pb-1.5 font-serif text-sm font-bold">
          Mempelai Wanita
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Panggilan <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Contoh: Ani"
              {...register('brideName')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.brideName?.message && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.brideName.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Lengkap & Gelar <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Contoh: Wati Setiawati, S.E."
              {...register('brideFullName')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.brideFullName?.message && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.brideFullName.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-foreground text-[11px] font-bold">
              Nama Orang Tua <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Contoh: Putri dari Bapak Hadi & Ibu Dewi"
              {...register('brideParents')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            {errors.brideParents?.message && (
              <p className="text-destructive px-1 text-[10px] font-medium">
                {errors.brideParents.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
