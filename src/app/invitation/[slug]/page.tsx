'use client';

import CountdownTimer from '@/components/invitation/count-time-section';
import CoverSection from '@/components/invitation/cover-section';
import EventCard from '@/components/invitation/event-section';
import GuestbookForm from '@/components/invitation/guest-book-section';
import RSVPForm from '@/components/invitation/rsvp-section';
import { TEMPLATES } from '@/constants/demo-preview';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Music, VolumeX } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
  const [isZooming, setIsZooming] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const isActive = TEMPLATES[currentIndex];

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsZooming(true);
    }, 4000);

    setTimeout(() => {
      setIsEntering(true);
      setIsMusicPlaying(true);
    }, 5500);
  };

  return (
    <AnimatePresence mode="wait">
      {!isEntering ? (
        <motion.div
          key="cover-screen"
          exit={{
            opacity: 0,
            filter: 'blur(20px)',
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="bg-background fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          <motion.div
            animate={
              isZooming
                ? { scale: 2, filter: 'blur(10px)' }
                : { scale: 1, filter: 'blur(0px)' }
            }
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="bg-background text-foreground w-full"
            style={isActive.cssVars as React.CSSProperties}
          >
            <CoverSection
              guestName={guestName}
              onOpen={handleOpen}
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
              isOpen={isOpen}
            />
          </motion.div>
        </motion.div>
      ) : (
        <div
          key="detail-wrapper"
          className="relative min-h-screen"
          style={isActive.cssVars as React.CSSProperties}
        >
          <motion.button
            initial={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors"
            aria-label={isMusicPlaying ? 'Matikan musik' : 'Nyalakan musik'}
          >
            {isMusicPlaying ? (
              <Music className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </motion.button>

          <motion.div
            key="detail-content"
            initial={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="bg-background text-foreground min-h-screen overflow-x-hidden"
          >
            <section className="bg-background relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-16">
              <div className="bg-primary-subtle absolute top-10 left-10 h-24 w-24 rounded-full opacity-40 blur-2xl" />
              <div className="bg-primary-subtle absolute right-10 bottom-10 h-32 w-32 rounded-full opacity-40 blur-2xl" />

              <p className="font-script text-primary mb-4 text-xl md:text-2xl">
                The Wedding of
              </p>

              <h1 className="font-display text-foreground mb-8 text-center text-4xl font-semibold italic md:text-6xl">
                {weddingData.groom.split(' ')[0]} &{' '}
                {weddingData.bride.split(' ')[0]}
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
                    <div className="bg-primary-subtle mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
                      <Heart className="text-primary h-12 w-12" />
                    </div>
                    <h2 className="font-display text-card-foreground mb-2 text-3xl font-semibold italic">
                      {weddingData.groom}
                    </h2>
                    <p className="text-muted-foreground opacity-80">
                      Putra dari
                      <br />
                      {weddingData.groomParents}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-primary-subtle mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
                      <Heart className="text-primary fill-primary h-12 w-12" />
                    </div>
                    <h2 className="font-display text-card-foreground mb-2 text-3xl font-semibold italic">
                      {weddingData.bride}
                    </h2>
                    <p className="text-muted-foreground opacity-80">
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
                <h2 className="text-card-foreground mb-12 text-center font-serif text-3xl font-bold">
                  Foto Pre-wedding
                </h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {weddingData.photos.map((_, index) => (
                    <div
                      key={index}
                      className="bg-primary-subtle flex aspect-square items-center justify-center rounded-xl"
                    >
                      <Heart className="text-primary h-8 w-8 opacity-30" />
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
                <h2 className="text-card-foreground mb-4 text-center font-serif text-3xl font-bold">
                  Ucapan & Doa
                </h2>
                <p className="text-muted-foreground mb-8 text-center opacity-80">
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
                        <div className="bg-primary-subtle flex h-8 w-8 items-center justify-center rounded-full">
                          <span className="text-primary-dark text-xs font-semibold">
                            {msg.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">
                            {msg.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {msg.time}
                          </p>
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
                  Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                  kepada kedua mempelai.
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
