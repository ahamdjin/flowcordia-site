import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/website/theme-provider';
import { GeistMono } from 'geist/font/mono';
import { TooltipProvider } from '@/components/ui/tooltip';
const inter = Inter({ subsets: ['latin'] });
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'Flowcordia - Build visually. Govern as code.',
  description:
    'Flowcordia is an open-source, Git-native workflow platform connecting a visual studio, typed functions, reviewed changes, and exact-version execution.',
  icons: {
    icon: '/flowcordia-logo-black.svg',
    shortcut: '/flowcordia-logo-black.svg',
    apple: '/flowcordia-logo-black.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} ${geistMono.variable} bg-white font-sans antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider attribute='class'>
          <TooltipProvider>
            <div className='isolate min-h-screen'>{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
