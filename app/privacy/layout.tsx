import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'WolfWhale LMS privacy policy. Learn how we protect student data with FERPA and PIPEDA compliance. Canadian data sovereignty guaranteed.',
  alternates: { canonical: 'https://wolfwhale.ca/privacy' },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
