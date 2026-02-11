import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wolfwhale.ca";

export const metadata: Metadata = {
  title: {
    default: "Wolf Whale - Learning Management System",
    template: "%s | WolfWhale LMS",
  },
  description:
    "WolfWhale LMS is a modern learning management system featuring interactive courses, quizzes, flashcards with spaced repetition, and certificates. Start your learning journey today.",
  keywords: [
    "LMS",
    "learning management system",
    "online courses",
    "e-learning",
    "education",
    "quizzes",
    "flashcards",
    "spaced repetition",
    "certificates",
    "interactive learning",
  ],
  authors: [{ name: "WolfWhale" }],
  creator: "WolfWhale",
  publisher: "WolfWhale",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "WolfWhale LMS",
    title: "Wolf Whale - Learning Management System",
    description:
      "Modern learning management system with interactive courses, quizzes, flashcards, and certificates.",
    images: [
      {
        url: "/link-card.png",
        width: 1200,
        height: 630,
        alt: "WolfWhale LMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wolf Whale - Learning Management System",
    description:
      "Modern learning management system with interactive courses, quizzes, flashcards, and certificates.",
    images: ["/link-card.png"],
    creator: "@wolfwhale",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2a4e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Shippori Mincho B1 — used for Wolf Whale branding text */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SoundProvider>
            {children}
            <Toaster richColors position="top-right" />
          </SoundProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
