import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '../ui/button';
import { CheckIcon } from '../ui/check';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function RSVPForm({ guestName }: { guestName: string }) {
  const [status, setStatus] = useState<'hadir' | 'tidak_hadir' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          readOnly
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
        <div className="space-y-2">
          <Label htmlFor="guests">Jumlah Tamu yang Hadir</Label>
          <Input
            id="guests"
            type="number"
            min="1"
            max="5"
            defaultValue="1"
            className="border-border bg-background"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={!status}
        className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground w-full"
      >
        Kirim Konfirmasi
      </Button>
    </form>
  );
}
