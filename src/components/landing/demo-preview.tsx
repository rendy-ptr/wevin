'use client';

import { Button } from '@/components/ui/button';
import { TEMPLATES } from '@/constants/demo-preview';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { ChevronLeftIcon } from '../ui/chevron-left';

export function DemoPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TEMPLATES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
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

            <div className="max-w-2xl flex-1">
              <div
                className={`${TEMPLATES[currentIndex].preview} border-border relative aspect-[4/5] overflow-hidden rounded-2xl border shadow-xl md:aspect-[3/4]`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <p
                    className={cn(
                      'font-script mb-2 text-xl opacity-90 md:text-2xl',
                      TEMPLATES[currentIndex].textColor,
                    )}
                  >
                    The Wedding of
                  </p>
                  <h3
                    className={cn(
                      'font-display mb-4 text-4xl font-semibold italic md:text-6xl',
                      TEMPLATES[currentIndex].textColor,
                    )}
                  >
                    Rendy & Winka
                  </h3>
                  <div
                    className={cn(
                      'mb-4 h-px w-24 opacity-30',
                      TEMPLATES[currentIndex].textColor.replace('text-', 'bg-'),
                    )}
                  />
                  <p
                    className={cn(
                      'font-medium opacity-80',
                      TEMPLATES[currentIndex].textColor,
                    )}
                  >
                    Sabtu, 08 Desember 2005
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-sm opacity-70',
                      TEMPLATES[currentIndex].textColor,
                    )}
                  >
                    Hotel Grand Ballroom, Jakarta
                  </p>

                  <div className="border-primary/20 absolute top-4 left-4 h-16 w-16 rounded-full border" />
                  <div className="border-primary/20 absolute right-4 bottom-4 h-20 w-20 rounded-full border" />
                </div>
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
