import type { Metadata } from 'next';
import { ThemeHeader } from '@/components/theme-header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="calming"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <ThemeHeader />
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