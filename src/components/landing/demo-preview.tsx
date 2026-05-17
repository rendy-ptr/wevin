'use client';

import { Button } from '@/components/ui/button';
import { TEMPLATES } from '@/constants/template.constant';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import Book from '../shared/book';
import { ChevronLeftIcon } from '../ui/chevron-left';

export function DemoPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TEMPLATES.length);
    setIsOpen(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="font-script text-primary mb-2 text-2xl">Preview</p>
          <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
            Lihat Contoh Undangan
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Desain elegan yang bisa disesuaikan dengan tema pernikahan Anda.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="border-border hover:bg-card cursor-pointer rounded-full"
              aria-label="Previous template"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>

            <div className="w-full max-w-[320px] md:max-w-[380px]">
              <div
                className="relative aspect-[4/5] w-full perspective-[1500px]"
                style={TEMPLATES[currentIndex].cssVars as React.CSSProperties}
              >
                <Book
                  isActive={TEMPLATES[currentIndex]}
                  isOpen={isOpen}
                  handleToggleOpen={handleToggleOpen}
                  groom="Groom"
                  bride="Bride"
                  guestName="Guest Name"
                  showHint={false}
                />
              </div>

              <div className="mt-6 text-center">
                <p className="text-foreground font-serif text-lg font-semibold">
                  {TEMPLATES[currentIndex].name}
                </p>
                <p className="text-muted-foreground text-sm">
                  Aksen: {TEMPLATES[currentIndex].accent}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="border-border hover:bg-card cursor-pointer rounded-full"
              aria-label="Next template"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {TEMPLATES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-border hover:bg-primary/50'
                }`}
                aria-label={`Go to template ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
