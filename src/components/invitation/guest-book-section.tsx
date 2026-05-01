import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export default function GuestbookForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-4 text-center">
        <p className="text-success font-medium">Ucapan Anda telah terkirim!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          placeholder="Nama Anda"
          required
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
        />
      </div>
      <Button
        type="submit"
        className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground w-full"
      >
        Kirim Ucapan
      </Button>
    </form>
  );
}
