import type { MetadataRoute } from 'next'

// Disallow rules cover all authenticated routes and API endpoints:
// /admin/* includes /admin/mission-control, /admin/dashboard, etc.
// /api/* includes /api/cron/*, /api/mission-control/*, /api/health, etc.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/student/', '/teacher/', '/admin/', '/parent/', '/api/', '/messaging/'],
    },
    sitemap: 'https://wolfwhale.ca/sitemap.xml',
  }
}
