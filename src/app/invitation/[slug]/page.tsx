'use client';

import CoverSection from '@/components/invitation/cover-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Music,
  Send,
  VolumeX,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const weddingData = {
  groom: '-',
  groomParents: 'Bapak Joko Santoso & Ibu Sri Wahyuni',
  bride: '-',
  brideParents: 'Bapak Hadi Wijaya & Ibu Dewi Lestari',
  akad: {
    date: 'Sabtu, 15 Juni 2024',
    time: '08:00 WIB',
    location: 'Masjid Al-Ikhlas',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    mapsUrl: 'https://goo.gl/maps/example',
  },
  resepsi: {
    date: 'Sabtu, 15 Juni 2024',
    time: '11:00 - 14:00 WIB',
    location: 'Hotel Grand Ballroom',
    address: 'Jl. Thamrin No. 456, Jakarta Pusat',
    mapsUrl: 'https://goo.gl/maps/example',
  },
  targetDate: new Date('2024-06-15T08:00:00'),
  photos: [
    '/placeholder-1.jpg',
    '/placeholder-2.jpg',
    '/placeholder-3.jpg',
    '/placeholder-4.jpg',
    '/placeholder-5.jpg',
    '/placeholder-6.jpg',
  ],
};

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

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 md:gap-6">
      {[
        { value: timeLeft.days, label: 'Hari' },
        { value: timeLeft.hours, label: 'Jam' },
        { value: timeLeft.minutes, label: 'Menit' },
        { value: timeLeft.seconds, label: 'Detik' },
      ].map((item, index) => (
        <div key={index} className="text-center">
          <div className="bg-card border-border mb-2 flex h-16 w-16 items-center justify-center rounded-xl border md:h-20 md:w-20">
            <span className="text-foreground font-serif text-2xl font-bold md:text-3xl">
              {item.value.toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function EventCard({
  title,
  date,
  time,
  location,
  address,
  mapsUrl,
}: {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapsUrl: string;
}) {
  return (
    <div className="bg-card border-border rounded-2xl border p-6 md:p-8">
      <h3 className="text-foreground mb-6 text-center font-serif text-2xl font-bold">
        {title}
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="text-primary mt-0.5 h-5 w-5" />
          <div>
            <p className="text-foreground font-medium">{date}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="text-primary mt-0.5 h-5 w-5" />
          <div>
            <p className="text-foreground font-medium">{time}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="text-primary mt-0.5 h-5 w-5" />
          <div>
            <p className="text-foreground font-medium">{location}</p>
            <p className="text-muted-foreground text-sm">{address}</p>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        className="border-primary text-primary-dark hover:bg-primary/10 mt-6 w-full"
        asChild
      >
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin className="mr-2 h-4 w-4" />
          Buka Maps
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}

function RSVPForm({ guestName }: { guestName: string }) {
  const [status, setStatus] = useState<'hadir' | 'tidak_hadir' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="bg-success/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Check className="text-success h-8 w-8" />
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
              status === 'hadir' && 'bg-success/10 border-success text-success',
            )}
          >
            <Check className="mr-2 h-5 w-5" />
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
        className="bg-primary-dark hover:bg-primary-dark/90 w-full text-white"
      >
        Kirim Konfirmasi
      </Button>
    </form>
  );
}

function GuestbookForm() {
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
        className="bg-primary-dark hover:bg-primary-dark/90 w-full text-white"
      >
        <Send className="mr-2 h-4 w-4" />
        Kirim Ucapan
      </Button>
    </form>
  );
}

export default function UndanganPage(
  {
    //   params,
  }: {
    params: Promise<{ slug: string }>;
  },
) {
  //   const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to')?.replace(/\+/g, ' ') || '';

  const [isOpen, setIsOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMusicPlaying(true);
  };

  if (!isOpen) {
    return (
      <CoverSection
        groom={weddingData.groom}
        bride={weddingData.bride}
        guestName={guestName}
        onOpen={handleOpen}
      />
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <button
        onClick={() => setIsMusicPlaying(!isMusicPlaying)}
        className="bg-primary-dark hover:bg-primary-dark/90 fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-colors"
        aria-label={isMusicPlaying ? 'Matikan musik' : 'Nyalakan musik'}
      >
        {isMusicPlaying ? (
          <Music className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </button>

      <section className="from-card to-background relative flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b px-6 py-16">
        <div className="border-primary/20 absolute top-10 left-10 h-24 w-24 rounded-full border" />
        <div className="border-primary/20 absolute right-10 bottom-10 h-32 w-32 rounded-full border" />

        <p className="font-script text-primary mb-4 text-xl md:text-2xl">
          The Wedding of
        </p>

        <h1 className="font-display text-foreground mb-8 text-center text-4xl font-semibold italic md:text-6xl">
          {weddingData.groom.split(' ')[0]} & {weddingData.bride.split(' ')[0]}
        </h1>

        <div className="bg-accent mb-8 h-px w-24" />

        <p className="text-muted-foreground mb-8 text-center">
          {weddingData.akad.date}
        </p>

        <CountdownTimer targetDate={weddingData.targetDate} />
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-script text-primary mb-8 text-center text-2xl">
            Bismillahirrahmanirrahim
          </p>
          <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center leading-relaxed">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
            menyelenggarakan pernikahan putra-putri kami:
          </p>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
                <Heart className="text-primary h-12 w-12" />
              </div>
              <h2 className="font-display text-foreground mb-2 text-3xl font-semibold italic">
                {weddingData.groom}
              </h2>
              <p className="text-muted-foreground">
                Putra dari
                <br />
                {weddingData.groomParents}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
                <Heart className="text-primary fill-primary h-12 w-12" />
              </div>
              <h2 className="font-display text-foreground mb-2 text-3xl font-semibold italic">
                {weddingData.bride}
              </h2>
              <p className="text-muted-foreground">
                Putri dari
                <br />
                {weddingData.brideParents}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-script text-primary mb-2 text-center text-2xl">
            Waktu & Tempat
          </p>
          <h2 className="text-foreground mb-12 text-center font-serif text-3xl font-bold">
            Detail Acara
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EventCard
              title="Akad Nikah"
              date={weddingData.akad.date}
              time={weddingData.akad.time}
              location={weddingData.akad.location}
              address={weddingData.akad.address}
              mapsUrl={weddingData.akad.mapsUrl}
            />
            <EventCard
              title="Resepsi"
              date={weddingData.resepsi.date}
              time={weddingData.resepsi.time}
              location={weddingData.resepsi.location}
              address={weddingData.resepsi.address}
              mapsUrl={weddingData.resepsi.mapsUrl}
            />
          </div>
        </div>
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-script text-primary mb-2 text-center text-2xl">
            Galeri
          </p>
          <h2 className="text-foreground mb-12 text-center font-serif text-3xl font-bold">
            Foto Pre-wedding
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {weddingData.photos.map((_, index) => (
              <div
                key={index}
                className="bg-primary/10 flex aspect-square items-center justify-center rounded-xl"
              >
                <Heart className="text-primary/30 h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-md">
          <p className="font-script text-primary mb-2 text-center text-2xl">
            RSVP
          </p>
          <h2 className="text-foreground mb-4 text-center font-serif text-3xl font-bold">
            Konfirmasi Kehadiran
          </h2>
          <p className="text-muted-foreground mb-8 text-center">
            Mohon konfirmasi kehadiran Anda
          </p>

          <div className="bg-card border-border rounded-2xl border p-6 md:p-8">
            <RSVPForm guestName={guestName} />
          </div>
        </div>
      </section>

      <section className="bg-card px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <p className="font-script text-primary mb-2 text-center text-2xl">
            Guestbook
          </p>
          <h2 className="text-foreground mb-4 text-center font-serif text-3xl font-bold">
            Ucapan & Doa
          </h2>
          <p className="text-muted-foreground mb-8 text-center">
            Kirimkan ucapan dan doa terbaik Anda
          </p>

          <div className="bg-background border-border mb-8 rounded-2xl border p-6">
            <GuestbookForm />
          </div>

          <div className="space-y-4">
            {mockMessages.map((msg, index) => (
              <div
                key={index}
                className="bg-background border-border rounded-xl border p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
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

      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-lg">
          <Heart className="text-primary fill-primary mx-auto mb-6 h-8 w-8" />
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada
            kedua mempelai.
          </p>
          <p className="font-script text-primary mb-2 text-2xl">
            Atas kehadiran dan doa restunya, kami ucapkan terima kasih.
          </p>
          <p className="text-foreground font-serif text-xl font-semibold">
            {weddingData.groom.split(' ')[0]} &{' '}
            {weddingData.bride.split(' ')[0]}
          </p>
        </div>
      </section>

      <footer className="bg-primary-dark px-6 py-8 text-center text-white">
        <p className="text-sm text-white/80">
          Powered by{' '}
          <span className="font-semibold">
            {process.env.NEXT_PUBLIC_APP_ALIAS ||
              process.env.NEXT_PUBLIC_APP_NAME ||
              'Configure on ENV'}
          </span>
        </p>
      </footer>
    </div>
  );
}
