import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ambassador Program — Earn with WolfWhale',
  description: 'Join the WolfWhale Ambassador Program and earn 5% of Year 1 revenue for every school you refer.',
  openGraph: {
    title: 'WolfWhale Ambassador Program',
    description: 'Earn 5% of Year 1 revenue for every school you refer.',
    url: 'https://wolfwhale.ca/referrals',
  },
}

export default function ReferralsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
