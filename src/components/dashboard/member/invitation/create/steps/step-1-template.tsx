import { TTemplate } from '@/types/template.type';
import { Check, Lock } from 'lucide-react';
import { FieldErrors, useFormContext, useWatch } from 'react-hook-form';

interface InvitationTemplateStepProps {
  allTemplates: TTemplate[];
  checkTemplateAllowed: (id: number) => boolean;
  errors?: FieldErrors;
}

export default function InvitationTemplateStep({
  allTemplates,
  checkTemplateAllowed,
  errors: propErrors,
}: InvitationTemplateStepProps) {
  const {
    setValue,
    control,
    formState: { errors: contextErrors },
  } = useFormContext();

  const errors = propErrors || contextErrors;

  const templateIdValue = useWatch({
    control,
    name: 'templateId',
  });

  const allowedTemplatesList = allTemplates.filter((t) =>
    checkTemplateAllowed(t.id),
  );
  const lockedTemplatesList = allTemplates.filter(
    (t) => !checkTemplateAllowed(t.id),
  );

  const renderTemplateCard = (
    template: TTemplate,
    isAllowed: boolean,
    index: number,
  ) => {
    const selected = templateIdValue === template.id;
    return (
      <div
        key={`${template.id}-${index}`}
        onClick={() => {
          if (!isAllowed) return;
          setValue('templateId', template.id, {
            shouldValidate: true,
          });
        }}
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          selected
            ? 'bg-primary/[0.03] border-primary/40 ring-primary/20 cursor-pointer shadow-md ring-1'
            : isAllowed
              ? 'border-border/40 hover:border-primary/20 cursor-pointer bg-transparent'
              : 'border-border/40 cursor-not-allowed opacity-80'
        }`}
      >
        {!isAllowed && (
          <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center pr-4 backdrop-blur-[1.5px]">
            <span className="bg-primary/90 flex items-center gap-1 rounded-md px-2.5 py-1 text-[9px] font-bold tracking-wide text-white uppercase shadow-sm">
              <Lock className="h-2.5 w-2.5" />
              Upgrade Package
            </span>
          </div>
        )}

        <div className="bg-secondary/20 relative aspect-[4/3] w-full overflow-hidden">
          <div
            className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${template.thumbnail || 'bg-secondary/20'}`}
          />
        </div>
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
            <Check className="h-3.5 w-3.5" />
          </div>
        </div>
        {selected && (
          <div className="bg-primary absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase shadow-lg">
            Selected
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-border/40 border-b pb-4">
        <h3 className="text-foreground font-serif text-lg font-bold tracking-tight">
          Pilih Desain Template
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Pilih tema desain dasar untuk undangan digital Anda. Pilihan ini akan
          menentukan seluruh dekorasi warna dan gaya halaman undangan Anda.
        </p>
      </div>

      {allowedTemplatesList.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allowedTemplatesList.map((t, i) => renderTemplateCard(t, true, i))}
        </div>
      )}

      {lockedTemplatesList.length > 0 && (
        <>
          <div className="border-border/40 my-8 border-b"></div>
          <div className="mb-4">
            <h4 className="text-foreground text-md font-serif font-bold tracking-tight">
              Template Premium (Terkunci)
            </h4>
            <p className="text-muted-foreground mt-1 text-xs">
              Tingkatkan paket Anda untuk menggunakan desain eksklusif di bawah
              ini.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lockedTemplatesList.map((t, i) => renderTemplateCard(t, false, i))}
          </div>
        </>
      )}

      {errors.templateId && (
        <p className="text-destructive px-1 text-[10px] font-medium">
          {errors.templateId.message as string}
        </p>
      )}
    </div>
  );
}
