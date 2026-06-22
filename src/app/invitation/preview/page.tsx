'use client';

import MemberPreviewClosingSection from '@/components/dashboard/member/invitation/member-preview/closing-section';
import MemberPreviewCoupleSection from '@/components/dashboard/member/invitation/member-preview/couple-section';
import MemberPreviewCoverSection from '@/components/dashboard/member/invitation/member-preview/cover-section';
import MemberPreviewEventSection from '@/components/dashboard/member/invitation/member-preview/event-section';
import MemberPreviewGallerySection from '@/components/dashboard/member/invitation/member-preview/gallery-section';
import MemberPreviewGuestbookSection from '@/components/dashboard/member/invitation/member-preview/guestbook-section';
import MemberPreviewHeroSection from '@/components/dashboard/member/invitation/member-preview/hero-section';
import MemberPreviewMusicButton from '@/components/dashboard/member/invitation/member-preview/music-button';
import MemberPreviewRSVPSection from '@/components/dashboard/member/invitation/member-preview/rsvp-section';
import { TEMPLATES } from '@/constants/template.constant';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface PreviewData {
  prefixTitle: string;
  groomName: string;
  brideName: string;
  eventDate: Date;
  placement: string;
  coverGreeting: string;
  coverQuote: string;

  openingGreeting: string;
  openingMessage: string;
  groomFullName: string;
  groomParents: string;
  brideFullName: string;
  brideParents: string;
  akad: {
    date: string;
    time: string;
    location: string;
    address: string;
    mapsUrl: string;
  };
  resepsi: {
    date: string;
    time: string;
    location: string;
    address: string;
    mapsUrl: string;
  };
  closingGreeting: string;
  closingMessage: string;
  photos: string[];
  musicUrl?: string;
  enabledFeatures: Record<string, boolean>;
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to')?.replace(/\+/g, ' ') || '';

  const [data, setData] = useState<PreviewData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('wevin_invitation_preview');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const themeIndex = TEMPLATES.findIndex(
          (t) => t.id === Number(parsed.themeId),
        );

        setTimeout(() => {
          if (themeIndex !== -1) {
            setCurrentIndex(themeIndex);
          }
          setData({
            // Data Step 2
            prefixTitle: parsed.prefixTitle || 'Persembahan Cinta',
            groomName: parsed.groomName || 'Groom Name',
            brideName: parsed.brideName || 'Bride Name',
            eventDate: parsed.eventDate
              ? new Date(parsed.eventDate)
              : new Date(),
            placement: parsed.placement || 'Lokasi Acara',
            coverGreeting: parsed.coverGreeting || 'With Love,',
            coverQuote:
              parsed.coverQuote ||
              '"Two souls with but a single thought, two hearts that beat as one."',

            // Data Step 3
            openingGreeting:
              parsed.openingGreeting || 'Bismillahirrahmanirrahim',
            openingMessage:
              parsed.openingMessage ||
              'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:',
            groomFullName: parsed.groomFullName || 'Groom Full Name',
            groomParents: parsed.groomParents || 'Groom Parents',
            brideFullName: parsed.brideFullName || 'Bride Full Name',
            brideParents: parsed.brideParents || 'Bride Parents',
            akad: {
              date: parsed.akadDate || 'Sabtu, 15 Juni 2024',
              time: parsed.akadTime || '08:00 WIB',
              location: parsed.akadLocation || 'Masjid Al-Ikhlas',
              address:
                parsed.akadAddress || 'Jl. Sudirman No. 123, Jakarta Selatan',
              mapsUrl: parsed.akadMapsUrl || '#',
            },
            resepsi: {
              date: parsed.resepsiDate || 'Sabtu, 15 Juni 2024',
              time: parsed.resepsiTime || '11:00 - 14:00 WIB',
              location: parsed.resepsiLocation || 'Hotel Grand Ballroom',
              address:
                parsed.resepsiAddress || 'Jl. Thamrin No. 456, Jakarta Pusat',
              mapsUrl: parsed.resepsiMapsUrl || '#',
            },
            closingMessage:
              parsed.closingMessage ||
              'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.',
            closingGreeting:
              parsed.closingGreeting ||
              'Atas kehadiran dan doa restunya, kami ucapkan terima kasih.',
            photos:
              parsed.gallery?.length > 0
                ? parsed.gallery.map((g: { imageUrl: string }) => g.imageUrl)
                : [],
            musicUrl: parsed.musicUrl || '',
            enabledFeatures: parsed.enabledFeatures || {},
          });

          // Data Step 1
          if (parsed.templateId) {
            const idx = TEMPLATES.findIndex((t) => t.id === parsed.templateId);
            if (idx !== -1) setCurrentIndex(idx);
          }
        }, 0);
      } catch (e) {
        console.error('Gagal membaca data preview', e);
      }
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

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

  if (!data) {
    return (
      <div className="bg-background flex h-screen w-full flex-col items-center justify-center">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground mt-4">Menyiapkan Live Preview...</p>
      </div>
    );
  }

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
            <MemberPreviewCoverSection
              guestName={guestName}
              onOpen={handleOpen}
              currentIndex={currentIndex}
              isOpen={isOpen}
              groom={data.groomName}
              bride={data.brideName}
              prefixTitle={data.prefixTitle}
              coverGreeting={data.openingGreeting}
              coverQuote={data.coverQuote}
              eventDate={data.eventDate}
              placement={data.placement}
            />
          </motion.div>
        </motion.div>
      ) : (
        <div
          key="detail-wrapper"
          className="relative min-h-screen"
          style={isActive.cssVars as React.CSSProperties}
        >
          {data?.musicUrl && (
            <MemberPreviewMusicButton
              isMusicPlaying={isMusicPlaying}
              setIsMusicPlaying={setIsMusicPlaying}
            />
          )}

          <motion.div
            key="detail-content"
            initial={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="bg-background text-foreground min-h-screen overflow-x-hidden"
          >
            <MemberPreviewHeroSection data={data} />

            <MemberPreviewCoupleSection data={data} />

            <MemberPreviewEventSection data={data} />

            <MemberPreviewGallerySection data={data} />

            {data.enabledFeatures?.rsvp && (
              <MemberPreviewRSVPSection guestName={guestName} />
            )}

            {data.enabledFeatures?.guestbook && (
              <MemberPreviewGuestbookSection />
            )}
            <MemberPreviewClosingSection data={data} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
