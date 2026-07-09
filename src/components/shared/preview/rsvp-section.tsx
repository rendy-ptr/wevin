import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/check';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import { RSVPStatusEnum } from '@/enums/invitation.enum';
import { useSubmitPublicRSVP } from '@/hooks/api/use-invitation-rsvp';
import { useToast } from '@/hooks/use-toast';
import {
  CreateRSVPFormValues,
  createRSVPSchema,
} from '@/validations/member/create-rsvp';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useForm, useWatch } from 'react-hook-form';

interface PreviewRSVPFormProps {
  guestName: string;
  invitationId: number;
  isPreview?: boolean;
}

export default function PreviewRSVPForm({
  guestName,
  invitationId,
  isPreview = false,
}: PreviewRSVPFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { mutate: submitRSVP, isPending } = useSubmitPublicRSVP();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, control } =
    useForm<CreateRSVPFormValues>({
      resolver: zodResolver(createRSVPSchema),
      defaultValues: {
        invitationId,
        guestName,
        guestCount: 1,
        reason: '',
      },
    });

  const status = useWatch({
    control,
    name: 'status',
  });

  const onSubmit = (data: CreateRSVPFormValues) => {
    if (isPreview) {
      toast({
        title: 'Mode Preview',
        description:
          'Simulasi RSVP berhasil! (Data tidak disimpan di database)',
      });
      setSubmitted(true);
      return;
    }

    submitRSVP(
      {
        ...data,
        reason:
          data.status === RSVPStatusEnum.NotPresent ? data.reason : undefined,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message: string }>;
          toast({
            title: 'Gagal',
            description:
              err.response?.data?.message || 'Gagal mengirim konfirmasi',
            variant: 'destructive',
          });
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="bg-primary-subtle mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckIcon className="text-success h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-2 font-serif text-xl font-semibold">
          Terima Kasih!
        </h3>
        <p className="text-muted-foreground">
          Konfirmasi kehadiran Anda telah kami terima.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Nama</Label>
        <Input
          defaultValue={guestName}
          className="border-border bg-background"
          readOnly
        />
      </div>

      <div className="space-y-2">
        <Label>Konfirmasi Kehadiran</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setValue('status', RSVPStatusEnum.Present, {
                shouldValidate: true,
              })
            }
            disabled={isPending}
            className={cn(
              'border-border h-auto py-4',
              status === RSVPStatusEnum.Present &&
                'bg-primary-subtle border-success text-success',
            )}
          >
            <CheckIcon className="mr-2 h-5 w-5" />
            Hadir
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setValue('status', RSVPStatusEnum.NotPresent, {
                shouldValidate: true,
              })
            }
            disabled={isPending}
            className={cn(
              'border-border h-auto py-4',
              status === RSVPStatusEnum.NotPresent &&
                'bg-destructive/10 border-destructive text-destructive',
            )}
          >
            Tidak Hadir
          </Button>
        </div>
      </div>

      {status === RSVPStatusEnum.Present && (
        <div className="space-y-2">
          <Label htmlFor="guests">Jumlah Tamu yang Hadir</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max="5"
            {...register('guestCount', { valueAsNumber: true })}
            className="border-border bg-background"
            disabled={isPending}
          />
        </div>
      )}

      {status === RSVPStatusEnum.NotPresent && (
        <div className="space-y-2">
          <Label htmlFor="reason">Alasan Tidak Hadir</Label>
          <Input
            id="reason"
            type="text"
            placeholder="Ada Pekerjaan"
            {...register('reason')}
            className="border-border bg-background"
            disabled={isPending}
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={!status || isPending}
        className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground w-full"
      >
        {isPending ? 'Mengirim...' : 'Kirim Konfirmasi'}
      </Button>
    </form>
  );
}
