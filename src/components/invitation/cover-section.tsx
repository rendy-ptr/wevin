'use client';

import { TEMPLATES } from '@/constants/demo-preview';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Book from '../shared/book';
import { CheckIcon } from '../ui/check';
import { ChevronDownIcon } from '../ui/chevron-down';
import { ChevronUpIcon } from '../ui/chevron-up';

interface CoverSectionProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function CoverSection({
  guestName,
  isOpen,
  onOpen,
  currentIndex,
  onIndexChange,
}: CoverSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive = TEMPLATES[currentIndex];

  const handleToggleOpen = () => {
    onOpen();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-32 transition-colors duration-700',
        isActive.backgroundColor,
      )}
    >
      <div className="bg-primary/5 absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-accent/5 absolute -right-24 -bottom-24 h-64 w-64 rounded-full blur-3xl" />

      <div
        ref={dropdownRef}
        className={cn(
          'fixed top-6 right-6 z-50 cursor-pointer transition-opacity duration-500',
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center gap-3 rounded-full border border-black/5 bg-white/40 p-2 pr-4 shadow-sm backdrop-blur-md transition-all hover:bg-white/60 active:scale-95"
        >
          <div
            className={cn(
              'h-8 w-8 rounded-full shadow-inner',
              isActive.preview,
            )}
          />
          <span className="hidden text-xs font-bold tracking-widest text-black/60 uppercase md:block">
            {isActive.name}
          </span>
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-4 w-4 text-black/40 transition-transform duration-300" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-black/40 transition-transform duration-300" />
          )}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-black/5 bg-white/80 p-2 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-2 px-3 pt-2">
                <p className="text-[9px] font-bold tracking-[0.2em] text-black/40 uppercase">
                  Pilih Tema
                </p>
              </div>
              <div className="grid gap-1">
                {TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onIndexChange(index);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition-all hover:bg-black/5',
                      currentIndex === index ? 'bg-black/5' : '',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-6 w-6 rounded-full shadow-sm',
                          template.preview,
                        )}
                      />
                      <span className="text-sm font-medium text-black/70">
                        {template.name}
                      </span>
                    </div>
                    {currentIndex === index && (
                      <CheckIcon className="h-4 w-4 text-black/40" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="relative aspect-[4/5] w-full max-w-[320px] perspective-[2000px] md:max-w-[420px]">
          <Book
            isActive={isActive}
            isOpen={isOpen}
            handleToggleOpen={handleToggleOpen}
            groom="Groom"
            bride="Bride"
            guestName={guestName}
          />
        </div>
      </div>
    </section>
  );
}
