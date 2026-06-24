import { TTemplate } from '@/types/template.type';
import { Check } from 'lucide-react';
import { FieldErrors, useFormContext, useWatch } from 'react-hook-form';

interface InvitationTemplateStepProps {
  allowedTemplates: TTemplate[];
  errors?: FieldErrors;
}

export default function InvitationTemplateStep({
  allowedTemplates,
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allowedTemplates.map((template: TTemplate, index: number) => {
          const selected = templateIdValue === template.id;
          return (
            <div
              key={`${template.id}-${index}`}
              onClick={() => {
                setValue('templateId', template.id, {
                  shouldValidate: true,
                });
              }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                selected
                  ? 'bg-primary/[0.03] border-primary/40 ring-primary/20 shadow-md ring-1'
                  : 'border-border/40 hover:border-primary/20 bg-transparent'
              }`}
            >
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
        })}
      </div>

      {errors.templateId && (
        <p className="text-destructive px-1 text-[10px] font-medium">
          {errors.templateId.message as string}
        </p>
      )}
    </div>
  );
}
