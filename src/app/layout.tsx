import React from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <div className="mr-4 hidden md:flex">
              <nav className="flex items-center gap-6 text-sm">
                <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/">
                  Recettes
                </a>
                {/*<a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/ingredients">*/}
                {/*  Ingrédients*/}
                {/*</a>*/}
              </nav>
            </div>
          </div>
        </header>

        <main className="flex flex-col items-start container py-8 gap-4">{children}</main>
      </body>
    </html>
  );
}