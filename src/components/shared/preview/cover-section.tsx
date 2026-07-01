import Book from '@/components/shared/book';
import { TEMPLATES } from '@/constants/template.constant';
import { cn } from '@/lib/utils';

interface CoverSectionProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
  currentIndex: number;
  groomName: string;
  brideName: string;
  eventDate: Date;
  prefixTitle: string;
  coverGreeting: string;
  coverQuote: string;
  placement: string;
}

export default function PreviewCoverSection({
  guestName,
  isOpen,
  onOpen,
  currentIndex,
  groomName,
  brideName,
  eventDate,
  prefixTitle,
  coverGreeting,
  coverQuote,
  placement,
}: CoverSectionProps) {
  const isActive = TEMPLATES[currentIndex] || TEMPLATES[0];

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
            handleToggleOpen={onOpen}
            groom={groomName}
            bride={brideName}
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
