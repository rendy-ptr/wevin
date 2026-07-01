import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvitationStatusEnum } from '@/enums/invitation.enum';
import { useToast } from '@/hooks/use-toast';
import { CreateUpdateInvitationFormValues } from '@/validations/member/create-update-invitation';
import { Copy, ExternalLink } from 'lucide-react';
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
export default function InvitationPublishStep() {
  const form = useFormContext<CreateUpdateInvitationFormValues>();
  const { errors } = useFormState({ control: form.control });
  const { toast } = useToast();

  const recipientName = useWatch({
    control: form.control,
    name: 'recipientName',
  });

  const previewUrl = `http://localhost:3000/invitation/create-edit-preview?to=${encodeURIComponent(
    recipientName || 'Tamu Undangan',
  )}`;

  const copyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    toast({
      title: 'Link disalin!',
      description: 'URL undangan simulasi berhasil disalin.',
    });
  };

  const statusOptions = [
    {
      label: 'Draft',
      value: InvitationStatusEnum.Draft,
    },
    {
      label: 'Published',
      value: InvitationStatusEnum.Published,
    },
    {
      label: 'Expired',
      value: InvitationStatusEnum.Expired,
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div>
        <h3 className="text-foreground text-lg font-bold">Review & Publish</h3>
        <p className="text-muted-foreground text-sm">
          Simulasikan link undangan yang akan dibagikan, lalu atur status
          publikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="recipientName"
              className="text-foreground text-[11px] font-bold"
            >
              Nama Penerima (Simulasi){' '}
              <span className="text-muted-foreground font-normal">
                (Opsional)
              </span>
            </Label>
            <Input
              id="recipientName"
              placeholder="Contoh: Budi Santoso"
              {...form.register('recipientName')}
              className="border-border/60 focus:ring-primary/20 focus:border-primary h-11 rounded-xl bg-transparent px-4 text-xs shadow-sm transition-all focus:ring-2"
            />
            <p className="text-muted-foreground text-[10px] font-medium">
              Nama ini tidak disimpan, hanya dipakai untuk menampilkan contoh
              URL.
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="status"
              className="text-foreground text-[11px] font-bold"
            >
              Status Undangan <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Status Undangan" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className={`text-xs transition-colors ${opt.value === InvitationStatusEnum.Expired ? 'text-muted-foreground cursor-not-allowed' : 'hover:bg-primary/10 focus:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer'}`}
                        disabled={opt.value === InvitationStatusEnum.Expired}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status?.message && (
              <p className="text-xs text-red-500">
                {errors.status.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="bg-secondary/10 border-border/40 flex flex-col items-center justify-center space-y-4 rounded-xl border p-6 text-center">
          <h4 className="text-foreground text-sm font-semibold">
            Simulasi URL Undangan
          </h4>
          <div className="bg-background text-muted-foreground w-full rounded-md border p-3 text-xs break-all">
            {previewUrl}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="hover:bg-primary/10 hover:text-primary-dark focus:text-primary-dark cursor-pointer text-xs transition-colors"
            >
              <Copy className="mr-2 h-3 w-3" />
              Salin Link
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const values = form.getValues();
                localStorage.setItem(
                  'wevin_invitation_preview',
                  JSON.stringify(values),
                );
                window.open(
                  `/invitation/create-edit-preview?to=${encodeURIComponent(
                    form.getValues().recipientName || 'Tamu Undangan',
                  )}`,
                  '_blank',
                );
              }}
              className="bg-primary hover:bg-primary-dark cursor-pointer text-xs transition-colors"
            >
              <ExternalLink className="mr-2 h-3 w-3" />
              Buka Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
