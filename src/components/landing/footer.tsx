import { HeartIcon } from '@/components/ui/heart';
import { CONTACT, FOOTER_LINKS } from '@/constants/footer';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary-dark px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <HeartIcon className="text-accent fill-accent h-6 w-6" />
              <span className="font-serif text-2xl font-bold">
                {process.env.NEXT_PUBLIC_APP_ALIAS ||
                  process.env.NEXT_PUBLIC_APP_NAME ||
                  'Configure on ENV'}
              </span>
            </div>
            <p className="leading-relaxed text-white/80">
              Platform undangan pernikahan digital premium yang elegan dan
              personal untuk hari spesial Anda.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold">Navigasi</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.value}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold">
              Hubungi Kami
            </h4>
            <ul className="space-y-2 text-white/80">
              {CONTACT.map((contact, index) => (
                <li key={index}>
                  {contact.label}: {contact.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 md:flex-row">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()}{' '}
            {process.env.NEXT_PUBLIC_APP_ALIAS ||
              process.env.NEXT_PUBLIC_APP_NAME ||
              'Configure on ENV'}{' '}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
