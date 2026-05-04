import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

import QueryProvider from '@/components/providers/query-provider';
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
        <QueryProvider>{children}</QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Toaster />
      </body>
    </html>
  );
}
