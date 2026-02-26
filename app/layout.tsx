import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron, Share_Tech_Mono, Dela_Gothic_One } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
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

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const delaGothic = Dela_Gothic_One({
  variable: "--font-dela-gothic",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wolfwhale.ca";

export const metadata: Metadata = {
  title: {
    default: "WolfWhale | Learning Management System",
    template: "%s | WolfWhale",
  },
  description:
    "Canadian learning management system with built-in spaced repetition flashcards, AI tutoring, offline learning, and gamification for K-12 and post-secondary schools.",
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
    "iOS education app",
    "learning app",
    "K-12 learning platform",
    "post-secondary LMS",
    "mobile learning",
    "App Store",
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
    title: "WOLFWHALE LMS",
    description:
      "Canadian learning management system with built-in spaced repetition flashcards, AI tutoring, offline learning, and gamification for K-12 and post-secondary schools.",
    images: [
      {
        url: "/logo.png",
        width: 952,
        height: 895,
        alt: "WolfWhale LMS - Canadian Learning Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WOLFWHALE LMS",
    description:
      "Canadian learning management system with built-in spaced repetition flashcards, AI tutoring, offline learning, and gamification for K-12 and post-secondary schools.",
    images: ["/logo.png"],
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
            name: "WolfWhale Inc.",
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
            name: "WolfWhale LMS",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description:
              "WolfWhale LMS is a Canadian LMS built for K-12 and post-secondary education. Features include interactive courses, quizzes, spaced repetition flashcards, certificates, and FERPA compliant data handling.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "CAD",
            },
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${shareTechMono.variable} ${delaGothic.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
