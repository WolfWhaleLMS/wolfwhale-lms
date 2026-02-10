import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: { default: 'Wolf Whale LMS', template: '%s | Wolf Whale LMS' },
  description: 'Where Learning Comes Alive - A gamified K-12 Learning Management System',
  keywords: [
    'LMS',
    'Learning Management System',
    'K-12',
    'Education',
    'Gamification',
    'Virtual Learning',
  ],
  authors: [{ name: 'Wolf Whale LMS Team' }],
  creator: 'Wolf Whale LMS',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wolfwhale-lms.com',
    siteName: 'Wolf Whale LMS',
    title: 'Wolf Whale LMS - Where Learning Comes Alive',
    description: 'A gamified K-12 Learning Management System',
    images: [
      {
        url: 'https://wolfwhale-lms.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Wolf Whale LMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wolf Whale LMS',
    description: 'Where Learning Comes Alive',
    images: ['https://wolfwhale-lms.com/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
