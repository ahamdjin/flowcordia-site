import './globals.css';
import '@code-hike/mdx/dist/index.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/website/theme-provider';
import { ThemeFavicon } from '@/components/website/theme-favicon';
import { GeistMono } from 'geist/font/mono';
import { TooltipProvider } from '@/components/ui/tooltip';
const inter = Inter({ subsets: ['latin'] });
const geistMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL('https://flowcordia.com'),
  title: 'Flowcordia - Build visually. Govern as code.',
  description:
    'Flowcordia is an open-source, Git-native workflow platform connecting a visual studio, typed functions, reviewed changes, and exact-version execution.',
  openGraph: {
    title: 'Flowcordia - Visual workflows and TypeScript',
    description:
      'Explore the open-source Flowcordia beta, its workflow Studio and Source editor.',
    url: 'https://flowcordia.com',
    siteName: 'Flowcordia',
    type: 'website',
    images: [
      {
        url: '/images/product/code-canvas.png',
        alt: 'Flowcordia code and canvas product demonstration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowcordia - Visual workflows and TypeScript',
    images: ['/images/product/code-canvas.png'],
  },
  icons: {
    icon: [
      {
        url: '/flowcordia-logo-black.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/flowcordia-logo-white.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
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
          <ThemeFavicon />
          <TooltipProvider>
            <div className='isolate min-h-screen'>{children}</div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
