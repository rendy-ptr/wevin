'use client';

import { TEMPLATES } from '@/constants/demo-preview';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface CoverSectionProps {
  guestName: string;
  onOpen: () => void;
  groom: string;
  bride: string;
}

export default function CoverSection({
  guestName,
  onOpen,
  groom,
  bride,
}: CoverSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  const isActive = TEMPLATES[currentIndex];

  return (
    <section className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="bg-primary/5 absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-accent/5 absolute -right-24 -bottom-24 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="mb-10 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
            Pilih Tema Undangan
          </p>
          <div className="border-border flex items-center gap-4 rounded-full border bg-white/10 p-3 shadow-sm backdrop-blur-sm">
            {TEMPLATES.map((template, index) => (
              <button
                key={index}
                onMouseEnter={() => setHoveredName(template.name)}
                onMouseLeave={() => setHoveredName(null)}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-8 w-8 cursor-pointer rounded-full transition-all duration-300 hover:scale-110 active:scale-95',
                  template.preview,
                  currentIndex === index
                    ? 'z-10 shadow-[0_0_0_2px_white,0_0_0_5px_rgba(0,0,0,0.1)]'
                    : 'opacity-70 hover:opacity-100',
                )}
                title={template.name}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-foreground font-serif text-sm font-bold opacity-80">
              {hoveredName || isActive.name}
            </p>
            <p className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase opacity-50">
              Accent Color: {isActive.accent}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'border-border relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 md:aspect-[3/4]',
            isActive.preview,
            isActive.textColor,
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <p className="font-script mb-2 text-xl opacity-80 md:text-2xl">
              The Wedding of
            </p>
            <h3 className="font-display mb-4 text-4xl leading-tight font-semibold italic md:text-6xl">
              {groom} & {bride}
            </h3>

            <div
              className={cn(
                'mx-auto mb-6 h-px w-20 opacity-30',
                isActive.textColor.replace('text-', 'bg-'),
              )}
            />

            <div className="mb-6 space-y-1">
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-50">
                Kepada Yth.
              </p>
              <p className="font-serif text-xl font-bold md:text-2xl">
                {guestName || 'Bapak/Ibu/Saudara/i'}
              </p>
            </div>

            <p className="mx-auto mb-8 max-w-[280px] text-xs leading-relaxed italic opacity-70 md:text-sm">
              &quot;Kami mengundang Anda untuk hadir di hari bahagia kami&quot;
            </p>

            <div className="space-y-1">
              <p className="text-sm font-medium tracking-wide opacity-80">
                Sabtu, 08 Desember 2005
              </p>
              <p className="text-[10px] opacity-60">
                Hotel Grand Ballroom, Jakarta
              </p>
            </div>

            <div className="absolute top-8 left-8 h-16 w-16 rounded-full border border-current/10" />
            <div className="absolute right-8 bottom-8 h-20 w-20 rounded-full border border-current/10" />
          </div>
        </div>

        <div className="mt-10">
          <Button
            onClick={onOpen}
            className="bg-primary-dark hover:bg-primary-dark/90 group flex items-center gap-2 rounded-2xl px-10 py-6 text-base text-white shadow-xl transition-all active:scale-95"
          >
            Buka Undangan
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
