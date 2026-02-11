import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Wolf Whale LMS terms of service for schools, educators, and students across Canada.',
  alternates: { canonical: 'https://wolfwhale.ca/terms' },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
