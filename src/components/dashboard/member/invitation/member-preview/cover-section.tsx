'use client';

import Book from '@/components/shared/book';
import { TEMPLATES } from '@/constants/template.constant';
import { cn } from '@/lib/utils';

interface MemberPreviewCoverSectionProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
  currentIndex: number;
  groom: string;
  bride: string;
  prefixTitle: string;
  coverGreeting: string;
  coverQuote: string;
  eventDate: Date;
  placement: string;
}

export default function MemberPreviewCoverSection({
  guestName,
  isOpen,
  onOpen,
  currentIndex,
  groom,
  bride,
  prefixTitle,
  coverGreeting,
  coverQuote,
  eventDate,
  placement,
}: MemberPreviewCoverSectionProps) {
  const isActive = TEMPLATES[currentIndex];

  const handleToggleOpen = () => {
    onOpen();
  };

  return (
    <section
      className={cn(
        'bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-32 transition-colors duration-700',
      )}
    >
      <div className="bg-primary-subtle absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-60 blur-3xl" />
      <div className="bg-primary-subtle absolute -right-24 -bottom-24 h-64 w-64 rounded-full opacity-60 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="relative aspect-[4/5] w-full max-w-[320px] perspective-[2000px] md:max-w-[420px]">
          <Book
            isActive={isActive}
            isOpen={isOpen}
            handleToggleOpen={handleToggleOpen}
            groom={groom}
            bride={bride}
            guestName={guestName}
            prefixTitle={prefixTitle}
            coverGreeting={coverGreeting}
            coverQuote={coverQuote}
            eventDate={eventDate}
            placement={placement}
          />
        </div>
      </div>
    </section>
  );
}
