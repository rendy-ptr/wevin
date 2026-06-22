import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const mockMessages = [
  {
    name: 'Pak Joko',
    message: 'Selamat menempuh hidup baru! Semoga sakinah mawaddah warahmah.',
    time: '2 jam lalu',
  },
  {
    name: 'Bu Siti',
    message: 'Happy wedding! Semoga langgeng sampai kakek nenek.',
    time: '5 jam lalu',
  },
  {
    name: 'Mas Andi',
    message: 'Congratulations bro! Wishing you both lifetime of love.',
    time: '1 hari lalu',
  },
];

export default function MemberPreviewGuestbookSection() {
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
    <section className="bg-card px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-script text-primary mb-2 text-center text-2xl">
          Guestbook
        </p>
        <h2 className="text-card-foreground mb-4 text-center font-serif text-3xl font-bold">
          Ucapan & Doa
        </h2>
        <p className="text-muted-foreground mb-8 text-center opacity-80">
          Kirimkan ucapan dan doa terbaik Anda
        </p>

        <div className="bg-background border-border mb-8 rounded-2xl border p-6">
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
        </div>

        <div className="space-y-4">
          {mockMessages.map((msg, index) => (
            <div
              key={index}
              className="bg-background border-border rounded-xl border p-4"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="bg-primary-subtle flex h-8 w-8 items-center justify-center rounded-full">
                  <span className="text-primary-dark text-xs font-semibold">
                    {msg.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {msg.name}
                  </p>
                  <p className="text-muted-foreground text-xs">{msg.time}</p>
                </div>
              </div>
              <p className="text-foreground text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
