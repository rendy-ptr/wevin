'use client';

import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/check';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RSVPFormHybridProps {
  guestName: string;
  guestId?: number;
  onSubmitSuccess?: (data: {
    status: 'hadir' | 'tidak_hadir';
    guestCount: number;
    message?: string;
  }) => void;
}

export default function RSVPFormHybrid({
  guestName,
  guestId,
  onSubmitSuccess,
}: RSVPFormHybridProps) {
  const [status, setStatus] = useState<'hadir' | 'tidak_hadir' | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;

    setIsSubmitting(true);
    try {
      // Integrasi API asli nanti:
      // const response = await fetch('/api/invitation-rsvp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ guestId, name: guestName, status, guestCount, message }),
      // });

      console.log('Mengirim RSVP Hybrid:', {
        guestId,
        name: guestName,
        status,
        guestCount,
        message,
      });

      if (onSubmitSuccess) {
        onSubmitSuccess({ status, guestCount, message });
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Gagal mengirim RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Nama</Label>
        <Input
          defaultValue={guestName}
          className="border-border bg-background"
          readOnly={!!guestName}
          placeholder="Masukkan nama Anda"
        />
      </div>

      <div className="space-y-2">
        <Label>Konfirmasi Kehadiran</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStatus('hadir')}
            className={cn(
              'border-border h-auto py-4',
              status === 'hadir' &&
                'bg-primary-subtle border-success text-success',
            )}
          >
            <CheckIcon className="mr-2 h-5 w-5" />
            Hadir
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setStatus('tidak_hadir')}
            className={cn(
              'border-border h-auto py-4',
              status === 'tidak_hadir' &&
                'bg-destructive/10 border-destructive text-destructive',
            )}
          >
            Tidak Hadir
          </Button>
        </div>
      </div>

      {status === 'hadir' && (
        <div className="animate-in fade-in-50 space-y-2 duration-200">
          <Label htmlFor="guests">Jumlah Tamu yang Hadir</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max="10"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="border-border bg-background"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={!status || isSubmitting}
        className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground w-full"
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
      </Button>
    </form>
  );
}
