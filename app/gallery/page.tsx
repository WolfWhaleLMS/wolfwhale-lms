import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Palette,
  Frame,
  ChevronDown,
  Facebook,
  Gem,
  Trees,
  Brush,
  Shapes,
} from "lucide-react";
import { HoursList } from "./hours-list";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const GALLERY_IMAGES = [
  {
    src: "https://tsaskblobstorage.blob.core.windows.net/ics/524223956_1322627339865326_151836197536826038_n_gallery.jpg",
    alt: "Gallery interior showcasing local Saskatchewan artwork",
  },
  {
    src: "https://tsaskblobstorage.blob.core.windows.net/ics/525403249_1322627283198665_6576189129060969983_n_gallery.jpg",
    alt: "Artisan displays and handcrafted pieces",
  },
];

const ART_MEDIUMS = [
  {
    icon: Brush,
    title: "Painting",
    description: "Acrylics, oils, watercolours & mixed media from local painters",
  },
  {
    icon: Shapes,
    title: "Sculpture & Carving",
    description: "Wood, stone, and mixed-media sculptural works",
  },
  {
    icon: Gem,
    title: "Jewelry & Beadwork",
    description: "Hand-crafted jewelry, intricate beading & caribou tufting",
  },
  {
    icon: Palette,
    title: "Pottery & Ceramics",
    description: "Wheel-thrown and hand-built vessels & functional art",
  },
  {
    icon: Trees,
    title: "Indigenous Art",
    description: "Birch bark biting, caribou tufting & traditional crafts",
  },
  {
    icon: Frame,
    title: "Custom Framing",
    description: "Full-service professional framing shop on-site",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2C2420]">
      {/* ───────────── Navigation ───────────── */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-[#FAF7F2]/80 border-b border-[#E8E0D4]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="font-[family-name:var(--font-playfair)] text-xl font-semibold tracking-tight text-[#2C2420]">
            On The Avenue
          </span>
          <div className="hidden items-center gap-8 font-[family-name:var(--font-inter)] text-sm md:flex">
            <a href="#about" className="text-[#6B5C4D] transition hover:text-[#2C2420]">
              About
            </a>
            <a href="#art" className="text-[#6B5C4D] transition hover:text-[#2C2420]">
              Art &amp; Mediums
            </a>
            <a href="#gallery" className="text-[#6B5C4D] transition hover:text-[#2C2420]">
              Gallery
            </a>
            <a href="#visit" className="text-[#6B5C4D] transition hover:text-[#2C2420]">
              Visit
            </a>
            <a
              href="#visit"
              className="rounded-full bg-[#2C2420] px-5 py-2 text-[#FAF7F2] transition hover:bg-[#4A3F37]"
            >
              Plan Your Visit
            </a>
          </div>
        </div>
      </nav>

      {/* ───────────── Hero ───────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4C4A8]/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#C4A87D]/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-[0.3em] text-[#9B8B78]">
            Prince Albert, Saskatchewan
          </p>

          <h1 className="mt-6 font-[family-name:var(--font-playfair)] text-5xl font-bold leading-tight tracking-tight text-[#2C2420] sm:text-6xl md:text-7xl lg:text-8xl">
            On The Avenue
            <br />
            <span className="italic text-[#8B7355]">Artisan&apos;s Gallery</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl font-[family-name:var(--font-inter)] text-lg leading-relaxed text-[#6B5C4D] sm:text-xl">
            A curated space where over 45 local and northern Saskatchewan artists
            showcase paintings, sculptures, Indigenous art, pottery, jewelry &amp; more
            on historic Central Avenue.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#visit"
              className="inline-flex items-center gap-2 rounded-full bg-[#2C2420] px-8 py-3.5 font-[family-name:var(--font-inter)] text-sm font-medium text-[#FAF7F2] transition hover:bg-[#4A3F37]"
            >
              <MapPin className="h-4 w-4" />
              Plan Your Visit
            </a>
            <a
              href="#art"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4C4A8] px-8 py-3.5 font-[family-name:var(--font-inter)] text-sm font-medium text-[#6B5C4D] transition hover:border-[#2C2420] hover:text-[#2C2420]"
            >
              Explore the Art
            </a>
          </div>

          {/* Quick info pills */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 font-[family-name:var(--font-inter)] text-xs text-[#9B8B78]">
            <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-4 py-2 shadow-sm">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              5.0 on TripAdvisor
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-4 py-2 shadow-sm">
              <Palette className="h-3.5 w-3.5" />
              45+ Artists
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-4 py-2 shadow-sm">
              <Frame className="h-3.5 w-3.5" />
              Custom Framing
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-[#C4A87D]" />
        </div>
      </section>

      {/* ───────────── About ───────────── */}
      <section id="about" className="scroll-mt-20 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={GALLERY_IMAGES[0].src}
                alt={GALLERY_IMAGES[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
            </div>

            {/* Text */}
            <div>
              <p className="font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-[0.3em] text-[#9B8B78]">
                Our Story
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#2C2420] sm:text-5xl">
                Where Art
                <br />
                Meets Community
              </h2>
              <div className="mt-8 space-y-5 font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#6B5C4D]">
                <p>
                  Nestled in the heart of Prince Albert&apos;s historic Central Avenue,
                  On The Avenue Artisan&apos;s Gallery is a vibrant creative hub where
                  local talent shines. More than just a gallery &mdash; it&apos;s a
                  community-driven space where artists rent their own display areas,
                  curate their selections, and set their own prices.
                </p>
                <p>
                  With over <strong>45 local and northern Saskatchewan artists</strong>,
                  the gallery showcases an extraordinary diversity of mediums &mdash;
                  from painters and potters to carvers, wood turners, and sculptors.
                  You&apos;ll find unique Indigenous art including birch bark biting,
                  caribou tufting, and intricate beadwork alongside contemporary
                  paintings, handmade jewelry, and functional pottery.
                </p>
                <p>
                  The gallery also houses a <strong>full-service framing shop</strong>,
                  making it your one-stop destination for finding and beautifully
                  presenting original Saskatchewan art.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Art & Mediums ───────────── */}
      <section id="art" className="scroll-mt-20 px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-[0.3em] text-[#9B8B78]">
            What You&apos;ll Discover
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#2C2420] sm:text-5xl">
            Art &amp; Mediums
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-inter)] text-base text-[#6B5C4D]">
            Every visit reveals something new, from traditional Indigenous crafts to
            contemporary works across a wide range of mediums.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ART_MEDIUMS.map((medium) => (
              <div
                key={medium.title}
                className="group rounded-2xl border border-[#E8E0D4] bg-white p-8 text-left transition hover:border-[#C4A87D] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#8B7355] transition group-hover:bg-[#2C2420] group-hover:text-[#FAF7F2]">
                  <medium.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#2C2420]">
                  {medium.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#6B5C4D]">
                  {medium.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Gallery Images ───────────── */}
      <section id="gallery" className="scroll-mt-20 bg-[#2C2420] px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-[0.3em] text-[#C4A87D]">
            Inside the Gallery
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#FAF7F2] sm:text-5xl">
            A Glimpse Inside
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-inter)] text-base text-[#A89B8C]">
            Step inside and explore the warmth and creativity that fills every corner
            of On The Avenue.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {GALLERY_IMAGES.map((image, i) => (
              <div
                key={i}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <p className="absolute bottom-4 left-4 font-[family-name:var(--font-inter)] text-sm text-white opacity-0 transition group-hover:opacity-100">
                  {image.alt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Testimonial / Quote ───────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <blockquote className="mt-8 font-[family-name:var(--font-playfair)] text-2xl font-medium italic leading-relaxed text-[#2C2420] sm:text-3xl">
            &ldquo;A hidden gem on Central Avenue. The variety of local art is
            incredible &mdash; from stunning paintings to beautiful Indigenous crafts.
            Every piece tells a Saskatchewan story.&rdquo;
          </blockquote>
          <p className="mt-6 font-[family-name:var(--font-inter)] text-sm text-[#9B8B78]">
            5.0 Stars on TripAdvisor
          </p>
        </div>
      </section>

      {/* ───────────── Visit / Hours / Map ───────────── */}
      <section id="visit" className="scroll-mt-20 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-[family-name:var(--font-inter)] text-xs font-medium uppercase tracking-[0.3em] text-[#9B8B78]">
              Plan Your Visit
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#2C2420] sm:text-5xl">
              Come See Us
            </h2>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            {/* Info column */}
            <div className="space-y-10">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#8B7355]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2C2420]">
                    Location
                  </h3>
                  <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-[#6B5C4D]">
                    1101 Central Avenue
                    <br />
                    Prince Albert, SK &nbsp;S6V 4V2
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=53.202982,-105.754620"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-[family-name:var(--font-inter)] text-sm font-medium text-[#8B7355] underline decoration-[#C4A87D] underline-offset-4 transition hover:text-[#2C2420]"
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#8B7355]">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2C2420]">
                    Phone
                  </h3>
                  <a
                    href="tel:3067631999"
                    className="mt-1 inline-block font-[family-name:var(--font-inter)] text-sm text-[#6B5C4D] transition hover:text-[#2C2420]"
                  >
                    (306) 763-1999
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#8B7355]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2C2420]">
                    Email
                  </h3>
                  <a
                    href="mailto:ontheavenueartgallery@gmail.com"
                    className="mt-1 inline-block font-[family-name:var(--font-inter)] text-sm text-[#6B5C4D] transition hover:text-[#2C2420]"
                  >
                    ontheavenueartgallery@gmail.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#8B7355]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2C2420]">
                    Hours
                  </h3>
                  <HoursList />
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <iframe
                title="On The Avenue Artisan's Gallery Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2383.5!2d-105.7546!3d53.203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDEyJzEwLjciTiAxMDXCsDQ1JzE2LjYiVw!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 450 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── CTA Banner ───────────── */}
      <section className="bg-[#2C2420] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#FAF7F2] sm:text-4xl">
            Support Local Saskatchewan Artists
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-inter)] text-base text-[#A89B8C]">
            Every purchase directly supports the artist who created it. Visit us on
            Central Avenue and take home a piece of northern Saskatchewan creativity.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=53.202982,-105.754620"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#C4A87D] px-8 py-3.5 font-[family-name:var(--font-inter)] text-sm font-medium text-[#2C2420] transition hover:bg-[#D4B88D]"
            >
              <MapPin className="h-4 w-4" />
              Get Directions
            </a>
            <a
              href="https://www.facebook.com/p/On-the-Avenue-Artisans-Gallery-100063542163636/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#4A3F37] px-8 py-3.5 font-[family-name:var(--font-inter)] text-sm font-medium text-[#C4A87D] transition hover:border-[#C4A87D]"
            >
              <Facebook className="h-4 w-4" />
              Follow on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer className="border-t border-[#E8E0D4] bg-[#FAF7F2] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#2C2420]">
                On The Avenue Artisan&apos;s Gallery
              </span>
              <p className="mt-1 font-[family-name:var(--font-inter)] text-xs text-[#9B8B78]">
                1101 Central Avenue, Prince Albert, SK &nbsp;S6V 4V2
              </p>
            </div>

            <div className="flex items-center gap-6 font-[family-name:var(--font-inter)] text-sm text-[#6B5C4D]">
              <a href="tel:3067631999" className="transition hover:text-[#2C2420]">
                (306) 763-1999
              </a>
              <a
                href="mailto:ontheavenueartgallery@gmail.com"
                className="transition hover:text-[#2C2420]"
              >
                Email
              </a>
              <a
                href="https://www.facebook.com/p/On-the-Avenue-Artisans-Gallery-100063542163636/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#2C2420]"
              >
                Facebook
              </a>
            </div>
          </div>

          <p className="mt-8 text-center font-[family-name:var(--font-inter)] text-xs text-[#B8A898]">
            &copy; {new Date().getFullYear()} On The Avenue Artisan&apos;s Gallery. All
            rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
