import React from 'react';

import { Providers } from '@/app/providers';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Translator',
  description: 'Translate this!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
