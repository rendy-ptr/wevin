'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartIcon } from '../ui/heart';
import { SparklesIcon } from '../ui/sparkles';

import { NumberTicker } from '../ui/number-ticker';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/floral-pattern.svg')] bg-repeat opacity-5" />
      <div className="bg-primary/10 absolute top-20 left-10 h-32 w-32 rounded-full blur-3xl" />
      <div className="bg-accent/10 absolute right-10 bottom-20 h-40 w-40 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="bg-primary/40 h-px w-12" />
          <SparklesIcon className="text-accent h-5 w-5" />
          <div className="bg-primary/40 h-px w-12" />
        </div>

        <p className="font-script text-primary mb-4 text-2xl md:text-3xl">
          Sampaikan Kabar Bahagia Anda
        </p>

        <h1 className="font-display text-foreground mb-6 text-5xl leading-tight font-semibold text-balance italic md:text-7xl lg:text-8xl">
          Wujudkan Undangan Pernikahan Impian Anda
        </h1>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl font-sans text-lg leading-relaxed text-pretty md:text-xl">
          Platform undangan pernikahan digital yang elegan dan personal. Setiap
          tamu mendapat link khusus dengan nama mereka sendiri.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary-dark hover:bg-primary-dark/90 rounded-xl px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Link href="#pricing">Lihat Paket</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary-dark hover:bg-primary/10 rounded-xl px-8 py-6 text-lg"
          >
            <Link href="/undangan/demo?to=Bapak+Ibu">
              <HeartIcon className="mr-2 h-5 w-5" />
              Lihat Contoh Undangan
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground mt-12 text-sm">
          Dipercaya oleh{' '}
          <span className="text-foreground font-semibold">
            <NumberTicker value={500} className="text-foreground" />+
          </span>{' '}
          pasangan di seluruh Indonesia
        </p>
      </div>
    </section>
  );
}
