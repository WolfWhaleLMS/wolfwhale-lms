import type { MetadataRoute } from 'next'
import { PAGES } from '@/lib/config/seo-pages'

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

  // Feature detail pages
  const featurePages: MetadataRoute.Sitemap = [
    'micro-lessons',
    'ai-tools',
    'textbooks',
    'offline',
    'teacher-tools',
    'gamification',
  ].map((slug) => ({
    url: `${baseUrl}/features/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // All SEO landing pages — auto-generated from PAGES config
  const landingPages: MetadataRoute.Sitemap = Object.keys(PAGES).map(
    (slug) => ({
      url: `${baseUrl}/lms/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  )

  return [...staticPages, ...featurePages, ...landingPages]
}
