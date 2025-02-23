import type { Metadata } from 'next';

import { getApiKey } from '@/app/actions';
import { AppSidebar } from '@/components/app-sidebar';
import { Byline } from '@/components/by-line';
import { KeyProvider } from '@/components/key-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Card } from '@/components/ui/card';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';


import './globals.css';



export const metadata: Metadata = {
  title: {
    default: 'FocusFlow',
    template: '%s | FocusFlow',
  },
  metadataBase: new URL('https://focusflow.vercel.app'),
  description: 'A modern Pomodoro timer with voice notes and focus tracking.',
  openGraph: {
    title: 'FocusFlow',
    description: 'A modern Pomodoro timer with voice notes and focus tracking.',
    images: [`/api/og?title=FocusFlow`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <header className="border-b">
              <div className="flex h-14 items-center px-4 md:px-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold">FocusFlow</h1>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm">Calming</Button>
                  <Button variant="ghost" size="sm">Energizing</Button>
                  <Button variant="ghost" size="sm">Sign Out</Button>
                </div>
              </div>
            </header>
            <main className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
