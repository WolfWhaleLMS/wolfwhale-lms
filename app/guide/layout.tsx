import type { Metadata } from 'next'
import { PianoMusicWrapper } from '@/components/music/PianoMusicWrapper'

export const metadata: Metadata = {
  title: 'User Guide | WolfWhale LMS',
  description:
    'Complete user guide for WolfWhale LMS. Learn how to use the platform as a student, teacher, parent, or administrator. Step-by-step workflows, feature overviews, and tips.',
  keywords: [
    'WolfWhale LMS guide',
    'LMS user guide',
    'student guide',
    'teacher guide',
    'parent portal guide',
    'admin guide',
  ],
  alternates: { canonical: 'https://wolfwhale.ca/guide' },
}

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PianoMusicWrapper>{children}</PianoMusicWrapper>
}
