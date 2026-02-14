import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About WolfWhale LMS - Features, Pricing & Demo',
  description:
    'Learn about WolfWhale LMS features: interactive courses, spaced repetition flashcards, quizzes, certificates, gamification, and more. Built for Canadian K-12 & post-secondary schools. FERPA & PIPEDA compliant.',
  keywords: [
    'WolfWhale LMS features',
    'LMS demo',
    'Canadian education platform',
    'school LMS features',
    'spaced repetition LMS',
  ],
  alternates: { canonical: 'https://wolfwhale.ca/info' },
}

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
