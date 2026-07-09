import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitPublicWish } from '@/hooks/api/use-invitation-wishes';
import { useToast } from '@/hooks/use-toast';
import {
  CreateWishFormValues,
  createWishSchema,
} from '@/validations/member/create-wish';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface PreviewGuestbookFormProps {
  guestName: string;
  invitationId: number;
  isPreview?: boolean;
}

export default function PreviewGuestbookForm({
  guestName,
  invitationId,
  isPreview = false,
}: PreviewGuestbookFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { mutate: submitWish, isPending } = useSubmitPublicWish();
  const { toast } = useToast();

  const { register, handleSubmit, control } = useForm<CreateWishFormValues>({
    resolver: zodResolver(createWishSchema),
    defaultValues: {
      invitationId,
      guestName,
      message: '',
    },
  });

  const message = useWatch({ control, name: 'message' });

  const onSubmit = (data: CreateWishFormValues) => {
    if (isPreview) {
      toast({
        title: 'Mode Preview',
        description:
          'Simulasi ucapan terkirim! (Data tidak disimpan di database)',
      });
      setSubmitted(true);
      return;
    }

    submitWish(data, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (error) => {
        const err = error as AxiosError<{ message: string }>;
        toast({
          title: 'Gagal',
          description: err.response?.data?.message || 'Gagal mengirim ucapan',
          variant: 'destructive',
        });
      },
    });
  };

  if (submitted) {
    return (
      <div className="py-4 text-center">
        <p className="text-success font-medium">Ucapan Anda telah terkirim!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Nama</Label>
        <Input
          defaultValue={guestName}
          readOnly
          className="border-border bg-background"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Ucapan & Doa</Label>
        <Textarea
          id="message"
          placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
          required
          rows={3}
          className="border-border bg-background resize-none"
          disabled={isPending}
          {...register('message')}
        />
      </div>
      <Button
        type="submit"
        disabled={isPending || !message.trim()}
        className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground w-full"
      >
        {isPending ? 'Mengirim...' : 'Kirim Ucapan'}
      </Button>
    </form>
  );
}
