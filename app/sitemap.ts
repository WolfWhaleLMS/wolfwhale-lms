import type { MetadataRoute } from 'next'

/** All programmatic SEO landing page slugs */
const LANDING_PAGE_SLUGS = [
  // City pages
  'toronto',
  'vancouver',
  'calgary',
  'ottawa',
  'edmonton',
  'montreal',
  'winnipeg',
  'halifax',
  // Use-case pages
  'k-12',
  'post-secondary',
  'canvas-alternative',
  'moodle-alternative',
  'brightspace-alternative',
  'spaced-repetition-lms',
  'ferpa-compliant-lms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wolfwhale.ca'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/info`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const landingPages: MetadataRoute.Sitemap = LANDING_PAGE_SLUGS.map(
    (slug) => ({
      url: `${baseUrl}/lms/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  )

  return [...staticPages, ...landingPages]
}
