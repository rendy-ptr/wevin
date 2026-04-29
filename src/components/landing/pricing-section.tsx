'use client';

import { Button } from '@/components/ui/button';
import { PACKAGES } from '@/constants/pricing-section';
import { cn } from '@/lib/utils';
import { CheckIcon } from '../ui/check';
import { StarIcon } from '../ui/star';

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="font-script text-primary mb-2 text-2xl">
            Paket & Harga
          </p>
          <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
            Pilih Paket Sesuai Kebutuhan
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Harga transparan tanpa biaya tersembunyi. Pilih paket yang sesuai
            dengan kebutuhan hari spesial Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {PACKAGES.map((pkg, index) => (
            <div
              key={index}
              className={cn(
                'relative flex flex-col rounded-2xl p-8 transition-all duration-300',
                pkg.popular
                  ? 'bg-primary-dark border-accent scale-105 border-2 text-white shadow-2xl'
                  : 'bg-card border-border border shadow-sm hover:shadow-md',
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground flex items-center gap-1 rounded-full px-4 py-1 text-sm font-semibold shadow-md">
                    <StarIcon className="h-4 w-4 fill-current" />
                    Terlaris
                  </div>
                </div>
              )}

              <div className="mb-8 text-center">
                <h3
                  className={cn(
                    'mb-2 font-serif text-2xl font-bold',
                    pkg.popular ? 'text-white' : 'text-foreground',
                  )}
                >
                  {pkg.name}
                </h3>
                <p
                  className={cn(
                    'mb-4 text-sm',
                    pkg.popular ? 'text-white/80' : 'text-muted-foreground',
                  )}
                >
                  {pkg.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className={cn(
                      'text-sm',
                      pkg.popular ? 'text-white/80' : 'text-muted-foreground',
                    )}
                  >
                    Rp
                  </span>
                  <span
                    className={cn(
                      'font-serif text-5xl font-bold',
                      pkg.popular ? 'text-white' : 'text-foreground',
                    )}
                  >
                    {pkg.price}
                  </span>
                </div>
              </div>

              <ul className="mb-8 flex-grow space-y-3">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon
                      className={cn(
                        'mt-0.5 h-5 w-5 flex-shrink-0',
                        pkg.popular ? 'text-accent' : 'text-success',
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm',
                        pkg.popular ? 'text-white/90' : 'text-foreground',
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  'w-full rounded-xl py-6 text-lg transition-all duration-300',
                  pkg.popular
                    ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground',
                )}
              >
                {pkg.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Semua harga sudah termasuk setup dan support. Pembayaran hanya sekali,
          bukan langganan.
        </p>
      </div>
    </section>
  );
}
