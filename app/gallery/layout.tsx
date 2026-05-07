import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "On The Avenue Artisan's Gallery | Prince Albert, SK",
  description:
    "Discover over 45 local and northern Saskatchewan artists at On The Avenue Artisan's Gallery. Paintings, sculptures, Indigenous art, pottery, jewelry & custom framing on Central Avenue in Prince Albert.",
  keywords: [
    "art gallery Prince Albert",
    "Saskatchewan art",
    "Indigenous art Saskatchewan",
    "local artists Prince Albert",
    "artisan gallery",
    "custom framing Prince Albert",
    "Central Avenue Prince Albert",
    "northern Saskatchewan artists",
    "pottery",
    "paintings",
    "sculptures",
    "birch bark biting",
    "caribou tufting",
    "beadwork",
  ],
  openGraph: {
    title: "On The Avenue Artisan's Gallery | Prince Albert, SK",
    description:
      "Over 45 local and northern artists. Paintings, sculptures, Indigenous art, pottery, jewelry & custom framing.",
    type: "website",
    images: [
      {
        url: "https://tsaskblobstorage.blob.core.windows.net/ics/524223956_1322627339865326_151836197536826038_n_gallery.jpg",
        width: 1200,
        height: 630,
        alt: "On The Avenue Artisan's Gallery interior",
      },
    ],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${playfair.variable} ${inter.variable}`}>{children}</div>
  );
}
