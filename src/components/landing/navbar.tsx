'use client';

import { Button } from '@/components/ui/button';
import { HeartIcon } from '@/components/ui/heart';
import { NAVBAR_LINKS } from '@/constants/navbar';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto max-w-6xl">
        <nav className="flex h-16 items-center justify-between">
          <Link href="#home" className="flex items-center gap-2">
            <HeartIcon className="text-primary fill-primary h-6 w-6" />
            <span className="text-foreground font-serif text-xl font-bold">
              {process.env.NEXT_PUBLIC_APP_ALIAS ||
                process.env.NEXT_PUBLIC_APP_NAME ||
                'Configure on ENV'}
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAVBAR_LINKS.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground hover:bg-secondary hover:text-foreground h-10 rounded-lg px-5 font-medium transition-all"
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button
              asChild
              className="bg-primary-dark hover:bg-primary-dark/90 rounded-lg text-white"
            >
              <Link href="#pricing">Mulai Sekarang</Link>
            </Button>
          </div>

          <button
            className="p-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="text-foreground h-6 w-6" />
            ) : (
              <Menu className="text-foreground h-6 w-6" />
            )}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="border-border border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Paket
              </Link>
              <Link
                href="/undangan/demo"
                className="text-muted-foreground hover:text-foreground py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contoh
              </Link>
              <Link
                href="#faq"
                className="text-muted-foreground hover:text-foreground py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <hr className="border-border" />
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground hover:bg-secondary hover:text-foreground h-10 justify-start px-5 font-medium transition-all"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Masuk
                </Link>
              </Button>
              <Button
                asChild
                className="bg-primary-dark hover:bg-primary-dark/90 text-white"
              >
                <Link href="#pricing" onClick={() => setIsMenuOpen(false)}>
                  Mulai Sekarang
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
