import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center - Wolf Whale LMS Support',
  description:
    'Get help with Wolf Whale LMS. Support resources for teachers, students, parents, and administrators.',
  alternates: { canonical: 'https://wolfwhale.ca/help' },
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
