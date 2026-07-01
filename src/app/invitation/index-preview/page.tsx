'use client';

import { TEMPLATES } from '@/constants/template.constant';
import { useGetInvitationById } from '@/hooks/api/use-invitation';
import { formatDate } from '@/lib/date';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Loader2, Music, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import PreviewCountdownTimer from '@/components/shared/preview/count-time-section';
import PreviewCoverSection from '@/components/shared/preview/cover-section';
import PreviewEventCard from '@/components/shared/preview/event-section';
import PreviewGuestbookForm from '@/components/shared/preview/guest-book-section';
import PreviewRSVPForm from '@/components/shared/preview/rsvp-section';

function IndexPreviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { data: values, isLoading } = useGetInvitationById(Number(id));

  const [isOpen, setIsOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasRewoundRef = useRef(false);

  useEffect(() => {
    if (!hasStarted) return;
    const url = values?.musicUrl;
    let ytId = null;
    if (url) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      ytId = match && match[2].length === 11 ? match[2] : null;
    }

    if (ytId && iframeRef.current) {
      if (isMusicPlaying) {
        if (!hasRewoundRef.current) {
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'seekTo',
              args: [0, true],
            }),
            '*',
          );
          hasRewoundRef.current = true;
        }
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          '*',
        );
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*',
        );
      } else {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'mute', args: [] }),
          '*',
        );
      }
    } else if (audioRef.current) {
      if (isMusicPlaying) {
        if (!hasRewoundRef.current) {
          audioRef.current.currentTime = 0;
          hasRewoundRef.current = true;
        }
        audioRef.current.muted = false;
        audioRef.current
          .play()
          .catch((e) => console.log('Audio autoplay prevented:', e));
      } else {
        audioRef.current.muted = true;
      }
    }
  }, [isMusicPlaying, hasStarted, values?.musicUrl]);

  if (isLoading || !values) {
    return (
      <div className="bg-background flex h-screen w-full flex-col items-center justify-center">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground mt-4">Memuat data undangan...</p>
      </div>
    );
  }

  const templateObj =
    TEMPLATES.find((t) => t.id === values.templateId) || TEMPLATES[0];
  const currentIndex = TEMPLATES.findIndex((t) => t.id === values.templateId);

  const events = values.events || [];
  const mainEvent = events[0] || {};

  let targetDate = new Date();
  if (mainEvent?.date) {
    targetDate = new Date(`${mainEvent.date}T${mainEvent.time || '00:00'}:00`);
  }

  const weddingData = {
    groom: values.groomName,
    groomParents: values.groomParents,
    bride: values.brideName,
    brideParents: values.brideParents,
    eventDate: mainEvent?.date ? new Date(mainEvent.date) : new Date(),
    photos: values.gallery?.map((g: { imageUrl: string }) => g.imageUrl) || [],
  };

  const coverData = {
    prefixTitle: values.prefixTitle,
    coverGreeting: values.coverGreeting,
    coverQuote: values.coverQuote,
    heroTitle: values.heroTitle,
  };

  const greetingData = {
    openingGreeting: values.openingGreeting,
    openingMessage: values.openingMessage,
  };

  const closingData = {
    closingMessage: values.closingMessage,
    closingGreeting: values.closingGreeting,
  };

  const urlGuestName = searchParams.get('to')?.replace(/\+/g, ' ');
  const guestName = urlGuestName || values.recipientName;

  const mockMessages = [
    {
      name: 'Sahabat Wevin',
      message: 'Selamat melihat preview undangan Anda!',
      time: 'Baru saja',
    },
  ];

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|live\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  };

  const ytId = values?.musicUrl ? getYoutubeId(values.musicUrl) : null;

  const handleOpen = () => {
    setIsOpen(true);
    setHasStarted(true);
    setTimeout(() => {
      setIsZooming(true);
    }, 4000);

    setTimeout(() => {
      setIsEntering(true);
      setIsMusicPlaying(true);
    }, 5500);
  };

  return (
    <>
      {values.musicUrl && hasStarted && (
        <div className="pointer-events-none fixed bottom-0 left-0 h-2 w-2 opacity-1">
          {ytId ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&disablekb=1&enablejsapi=1`}
              allow="autoplay; encrypted-media"
              className="h-full w-full"
              allowFullScreen
            />
          ) : (
            <audio
              ref={audioRef}
              src={values.musicUrl}
              autoPlay
              muted
              loop
              className="hidden"
            />
          )}
        </div>
      )}
      <AnimatePresence mode="wait">
        {!isEntering ? (
          <motion.div
            key="cover-screen"
            exit={{
              opacity: 0,
              filter: 'blur(20px)',
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="bg-background absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={templateObj.cssVars as React.CSSProperties}
          >
            <motion.div
              animate={
                isZooming
                  ? { scale: 2, filter: 'blur(10px)' }
                  : { scale: 1, filter: 'blur(0px)' }
              }
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="bg-background text-foreground h-full w-full"
            >
              <PreviewCoverSection
                groomName={weddingData.groom}
                brideName={weddingData.bride}
                guestName={guestName}
                eventDate={weddingData.eventDate}
                onOpen={handleOpen}
                currentIndex={currentIndex >= 0 ? currentIndex : 0}
                isOpen={isOpen}
                prefixTitle={coverData.prefixTitle}
                coverGreeting={coverData.coverGreeting}
                coverQuote={coverData.coverQuote}
                placement={mainEvent.location}
              />
            </motion.div>
          </motion.div>
        ) : (
          <div
            key="detail-wrapper"
            className="relative min-h-screen"
            style={templateObj.cssVars as React.CSSProperties}
          >
            {values.musicUrl && (
              <motion.button
                initial={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                className="bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground fixed right-4 bottom-4 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors"
                aria-label={isMusicPlaying ? 'Matikan musik' : 'Nyalakan musik'}
              >
                {isMusicPlaying ? (
                  <Music className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </motion.button>
            )}

            <motion.div
              initial={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="bg-background text-foreground min-h-screen pb-20"
            >
              <section className="bg-primary-subtle relative overflow-hidden px-6 pt-24 pb-16">
                <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/20 blur-3xl" />

                <div className="relative mx-auto max-w-4xl">
                  <p className="font-script text-primary mb-6 text-center text-3xl">
                    {coverData.heroTitle}
                  </p>

                  <h1 className="font-display text-foreground mb-8 text-center text-4xl font-semibold italic md:text-6xl">
                    {weddingData.groom} & {weddingData.bride}
                  </h1>

                  <div className="bg-accent mx-auto mb-8 h-px w-24" />

                  <p className="text-muted-foreground mb-8 text-center">
                    {formatDate(weddingData.eventDate.toISOString())}
                  </p>

                  <PreviewCountdownTimer targetDate={targetDate} />
                </div>
              </section>

              <section className="bg-card px-6 py-16">
                <div className="mx-auto max-w-4xl">
                  <p className="font-script text-primary mb-8 text-center text-2xl">
                    {greetingData.openingGreeting}
                  </p>
                  <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center leading-relaxed">
                    {greetingData.openingMessage}
                  </p>

                  <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    <div className="text-center">
                      <div className="bg-primary-subtle mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full">
                        <Heart className="text-primary h-12 w-12" />
                      </div>
                      <h2 className="font-display text-card-foreground mb-2 text-3xl font-semibold italic">
                        {values.groomFullName || weddingData.groom}
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
                        {values.brideFullName || weddingData.bride}
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
                    {values.events?.map(
                      (
                        evt: {
                          title: string;
                          date: string;
                          time: string;
                          timezone?: string;
                          location: string;
                          address: string;
                          mapsUrl?: string;
                        },
                        idx: number,
                      ) => (
                        <PreviewEventCard
                          key={idx}
                          title={evt.title || '-'}
                          date={formatDate(
                            evt.date || new Date().toISOString(),
                          )}
                          time={`${evt.time || '-'}${evt.timezone ? ` ${evt.timezone}` : ''}`}
                          location={evt.location || '-'}
                          address={evt.address || '-'}
                          mapsUrl={evt.mapsUrl || '#'}
                        />
                      ),
                    )}
                  </div>
                </div>
              </section>

              {weddingData.photos.length > 0 && (
                <section className="bg-card px-6 py-16">
                  <div className="mx-auto max-w-4xl">
                    <p className="font-script text-primary mb-2 text-center text-2xl">
                      Galeri
                    </p>
                    <h2 className="text-card-foreground mb-12 text-center font-serif text-3xl font-bold">
                      Foto Pre-wedding
                    </h2>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {weddingData.photos.map((url: string, index: number) => (
                        <div
                          key={index}
                          className="bg-primary-subtle relative flex aspect-square items-center justify-center overflow-hidden rounded-xl"
                        >
                          {url ? (
                            <Image
                              src={url}
                              alt={`Gallery ${index}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                            />
                          ) : (
                            <Heart className="text-primary h-8 w-8 opacity-30" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {values.enabledFeatures?.['rsvp_form'] && (
                <section className="px-6 py-16">
                  <div className="mx-auto max-w-md">
                    <p className="font-script text-primary mb-2 text-center text-2xl">
                      Kehadiran
                    </p>
                    <h2 className="text-foreground mb-4 text-center font-serif text-3xl font-bold">
                      Konfirmasi Kehadiran
                    </h2>
                    <p className="text-muted-foreground mb-8 text-center">
                      Mohon konfirmasi kehadiran Anda
                    </p>

                    <div className="bg-card border-border rounded-2xl border p-6 md:p-8">
                      <PreviewRSVPForm guestName={guestName} />
                    </div>
                  </div>
                </section>
              )}

              {values.enabledFeatures?.guestbook && (
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
                      <PreviewGuestbookForm />
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
                          <p className="text-foreground text-sm">
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <section className="px-6 py-16 text-center">
                <div className="mx-auto max-w-lg">
                  <Heart className="text-primary fill-primary mx-auto mb-6 h-8 w-8" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {closingData.closingMessage}
                  </p>
                  <p className="font-script text-primary mb-2 text-2xl">
                    {closingData.closingGreeting}
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
    </>
  );
}

export default function IndexPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted/20 flex min-h-screen items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <IndexPreviewContent />
    </Suspense>
  );
}
