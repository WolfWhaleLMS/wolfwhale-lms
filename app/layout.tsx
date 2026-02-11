import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/seo/JsonLd";
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
    default: "Wolf Whale - Canadian Learning Management System for K-12 & Post-Secondary",
    template: "%s | Wolf Whale LMS",
  },
  description:
    "Wolf Whale is Canada's modern LMS with built-in spaced repetition flashcards, interactive courses, quizzes, and certificates. FERPA & PIPEDA compliant. The only learning platform with spaced repetition technology built in.",
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
    "Canadian LMS",
    "K-12 learning platform",
    "post-secondary LMS",
    "FERPA compliant",
    "PIPEDA compliant",
    "Canvas alternative",
    "Moodle alternative",
    "Brightspace alternative",
    "school learning management system",
    "LMS for schools Canada",
    "spaced repetition learning",
    "student data privacy",
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
    title: "Wolf Whale - Canadian Learning Management System for K-12 & Post-Secondary",
    description:
      "Canada's modern LMS with built-in spaced repetition flashcards, interactive courses, quizzes, and certificates. FERPA & PIPEDA compliant.",
    images: [
      {
        url: "/ww-card.png",
        width: 1200,
        height: 630,
        alt: "Wolf Whale LMS - Canadian Learning Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wolf Whale - Canadian Learning Management System for K-12 & Post-Secondary",
    description:
      "Canada's modern LMS with built-in spaced repetition flashcards, interactive courses, quizzes, and certificates. FERPA & PIPEDA compliant.",
    images: ["/ww-card.png"],
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
    { media: "(prefers-color-scheme: dark)", color: "#003C99" },
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Wolf Whale Inc.",
            url: "https://wolfwhale.ca",
            logo: "https://wolfwhale.ca/logo.png",
            description:
              "Canadian learning management system for K-12 & post-secondary education",
            sameAs: [],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Wolf Whale LMS",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description:
              "Wolf Whale LMS is a Canadian LMS built for K-12 and post-secondary education. Features include interactive courses, quizzes, spaced repetition flashcards, certificates, and FERPA compliant data handling.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "CAD",
            },
          }}
        />
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
