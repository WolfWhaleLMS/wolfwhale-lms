import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Wolf Whale LMS - Features, Pricing & Demo',
  description:
    'Learn about Wolf Whale LMS features: interactive courses, spaced repetition flashcards, quizzes, certificates, gamification, and more. Built for Canadian K-12 & post-secondary schools. FERPA & PIPEDA compliant.',
  keywords: [
    'Wolf Whale LMS features',
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
  return children
}
