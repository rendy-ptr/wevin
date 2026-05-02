import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';
import { constructMetadata } from '@/lib/metadata';

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Toaster />
      </body>
    </html>
  );
}
