'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Twitter, CheckCircle2, ChevronDown, Users, GraduationCap, Heart, Briefcase } from 'lucide-react'
import { ThemeToggle } from '@/components/landing/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { submitReferralForm, type ReferralFormState } from '@/app/actions/referral'
import type { Lang } from '@/lib/landing-i18n'

const inputClasses = "w-full h-11 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/30 focus:border-[#00BFFF]/50 transition-all"

const faqItems = [
  {
    q: 'When do I get paid?',
    a: 'Payouts happen quarterly. Once a school you referred completes their first invoice payment, your 5% commission is calculated and paid within 30 days of the quarter end.',
  },
  {
    q: 'How is it tracked?',
    a: 'Every ambassador gets a unique referral link. When a school signs up through your link or mentions your name during onboarding, the referral is attributed to you. You can track your referrals in a dashboard we provide.',
  },
  {
    q: 'Is there a cap on earnings?',
    a: 'No cap. If you refer 10 schools each with 500 students, you earn 5% of all their Year 1 revenue. The more schools you bring, the more you earn.',
  },
  {
    q: 'Who qualifies to be an ambassador?',
    a: 'Anyone. Teachers, parents, community members, education consultants, retired educators — if you know a school that could benefit from WolfWhale, you qualify.',
  },
  {
    q: 'What counts as Year 1 revenue?',
    a: 'Year 1 revenue is the total amount the school pays WolfWhale during their first 12 months of active subscription. This includes all user licenses at $12/user/month.',
  },
]

const whoCanRefer = [
  { icon: GraduationCap, title: 'Teachers', desc: 'You see the problems in education every day. Recommend a tool that actually works.' },
  { icon: Heart, title: 'Parents', desc: 'Know a school that could do better? Connect us and earn while helping students.' },
  { icon: Users, title: 'Community Members', desc: 'Board members, volunteers, anyone connected to a school can refer.' },
  { icon: Briefcase, title: 'Consultants', desc: 'EdTech consultants and advisors — add WolfWhale to your portfolio.' },
]

export default function ReferralsPage() {
  const searchParams = useSearchParams()
  const validLangs: Lang[] = ['en', 'fr']
  const lang: Lang = validLangs.includes(searchParams.get('lang') as Lang) ? (searchParams.get('lang') as Lang) : 'en'
  const lp = lang !== 'en' ? `?lang=${lang}` : ''

  // Calculator state
  const [students, setStudents] = useState(500)
  const monthlyRevenue = students * 12
  const annualRevenue = monthlyRevenue * 12
  const payout = annualRevenue * 0.05

  // FAQ state
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({})

  // Form state
  const initialState: ReferralFormState = { success: false }
  const [state, formAction, isPending] = useActionState(submitReferralForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  const fmt = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-black">

      {/* IT Summit 2026 Banner */}
      <div className="fixed top-[49px] sm:top-[53px] left-0 right-0 z-40 bg-[#00BFFF]/10 dark:bg-[#00BFFF]/5 border-b border-[#00BFFF]/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-pulse" />
          <span className="text-gray-700 dark:text-white/80 font-medium">IT Summit 2026 &mdash; See WolfWhale live</span>
          <a href="/#contact" className="text-[#00BFFF] font-semibold hover:underline ml-1">Book a Meeting &rarr;</a>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lp}`} className="inline-flex flex-col group shrink-0 min-w-0">
            <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#00BFFF] transition-colors duration-100 tracking-normal uppercase" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              WolfWhale
            </span>
            <span className="hidden sm:block text-xs text-gray-500 dark:text-white/60 tracking-[0.15em] uppercase font-medium -mt-0.5">
              Learning Management System
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href={`/${lp}#features`} className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium hidden sm:inline">
              Features
            </Link>
            <Link href={`/${lp}#pricing`} className="text-sm text-gray-600 dark:text-white/70 hover:text-[#00BFFF] transition-colors duration-100 font-medium hidden sm:inline">
              Pricing
            </Link>
            <LanguageToggle lang={lang} />
            <ThemeToggle />
            <a
              href={`/${lp}#contact`}
              className="inline-flex items-center h-9 sm:h-10 px-2.5 sm:px-4 rounded-lg sm:rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-[11px] sm:text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>
      {/* Spacer for fixed header + banner */}
      <div className="h-[80px] sm:h-[86px]" />

      <main className="relative z-10">

        {/* Hero Section */}
        <section className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] px-4 py-10 sm:py-20">
          <div className="w-full max-w-4xl text-center space-y-6 sm:space-y-8">
            <p className="text-xs text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase font-medium">Ambassador Program</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Earn Money Bringing WolfWhale to Your School
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-white/60 max-w-2xl mx-auto">
              5% of Year 1 revenue for every school you connect us with
            </p>

            {/* Stat badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-4">
              {[
                { value: '5%', label: 'Commission' },
                { value: '$12', label: '/user/month' },
                { value: 'No Cap', label: 'On Earnings' },
              ].map(({ value, label }) => (
                <div
                  key={value}
                  className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-center"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <a
              href="#signup"
              className="inline-flex items-center gap-2 h-12 px-8 sm:px-10 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm sm:text-base font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Become an Ambassador
              <ArrowRight className="h-5 w-5 -mr-1" />
            </a>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                How It Works
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                Three simple steps to start earning
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { step: '1', title: 'Sign Up', desc: 'Fill out the form below. We\'ll send you a unique referral link within 1 business day.' },
                { step: '2', title: 'Share', desc: 'Tell schools about WolfWhale. Share your link with administrators, teachers, or anyone who makes decisions.' },
                { step: '3', title: 'Get Paid', desc: 'When a school subscribes through your referral, you earn 5% of their entire Year 1 revenue.' },
              ].map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 text-center space-y-3"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-bold">
                    {step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-white/65 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings Calculator */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Earnings Calculator
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                See what you could earn from a single referral
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider font-medium">Students at the School</label>
                  <span className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    {students.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={students}
                  onChange={(e) => setStudents(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00BFFF] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:dark:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-white/30">
                  <span>100</span>
                  <span>500</span>
                  <span>1,000</span>
                  <span>2,500</span>
                  <span>5,000</span>
                </div>
              </div>

              {/* Results */}
              <div className="h-px bg-gray-200 dark:bg-white/10" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider">Monthly Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    {fmt(monthlyRevenue)}
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider">Annual Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    {fmt(annualRevenue)}
                  </p>
                </div>
                <div className="text-center space-y-1 bg-gray-900/5 dark:bg-white/5 rounded-xl p-3 -m-1">
                  <p className="text-xs text-[#00BFFF] uppercase tracking-wider font-semibold">Your 5% Payout</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    {fmt(payout)}
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 dark:text-white/30 text-center">
                Based on {students.toLocaleString()} students &times; $12/month &times; 12 months &times; 5%
              </p>
            </div>
          </div>
        </section>

        {/* Who Can Refer */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Who Can Refer
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-xl mx-auto">
                Anyone connected to a school qualifies
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whoCanRefer.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex items-start gap-3"
                >
                  <div className="inline-flex p-2 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/20 shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-[#00BFFF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-white/65 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sign-Up Form */}
        <section id="signup" className="px-4 py-10 sm:py-16">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Sign Up
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-white/70 max-w-lg mx-auto">
                Join the Ambassador Program in 30 seconds
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-8">
              {state.success ? (
                <div className="text-center space-y-4 py-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                    Welcome!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-white/70 max-w-md mx-auto leading-relaxed">
                    You&apos;re in. Our team will review your application and send your unique referral link within 1 business day. Keep an eye on your inbox.
                  </p>
                </div>
              ) : (
                <form ref={formRef} action={formAction} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ref-firstName" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="ref-firstName"
                        name="firstName"
                        type="text"
                        required
                        placeholder="First name"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="ref-lastName" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="ref-lastName"
                        name="lastName"
                        type="text"
                        required
                        placeholder="Last name"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="ref-email" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="ref-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@email.com"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="ref-phone" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
                        Phone <span className="text-gray-300 dark:text-white/20">(optional)</span>
                      </label>
                      <input
                        id="ref-phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (___) ___-____"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="ref-role" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
                        Your Role <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="ref-role"
                        name="role"
                        required
                        defaultValue=""
                        className={`${inputClasses} appearance-none`}
                      >
                        <option value="" disabled className="bg-white dark:bg-black text-gray-400 dark:text-white/50">Select your role</option>
                        <option value="teacher" className="bg-white dark:bg-black text-gray-900 dark:text-white">Teacher</option>
                        <option value="parent" className="bg-white dark:bg-black text-gray-900 dark:text-white">Parent</option>
                        <option value="community-member" className="bg-white dark:bg-black text-gray-900 dark:text-white">Community Member</option>
                        <option value="consultant" className="bg-white dark:bg-black text-gray-900 dark:text-white">Consultant / Advisor</option>
                        <option value="administrator" className="bg-white dark:bg-black text-gray-900 dark:text-white">School Administrator</option>
                        <option value="other" className="bg-white dark:bg-black text-gray-900 dark:text-white">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ref-institution" className="block text-xs text-gray-500 dark:text-white/60 uppercase tracking-wider mb-1.5 font-medium">
                        Institution <span className="text-gray-300 dark:text-white/20">(optional)</span>
                      </label>
                      <input
                        id="ref-institution"
                        name="institution"
                        type="text"
                        placeholder="School or organization"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  {state.error && (
                    <p className="text-sm text-red-500 dark:text-red-400">{state.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold transition-all duration-100 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Join the Ambassador Program
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-10 sm:py-16">
          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-100/50 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#00BFFF] flex-shrink-0 transition-transform duration-300 ${openFaq[idx] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq[idx] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-5 pb-4 text-sm sm:text-base text-gray-600 dark:text-white/65 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reassurance */}
        <section className="px-4 py-10">
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-400 dark:text-white/25">
            <span>No obligations</span>
            <span>Free to join</span>
            <span>Paid quarterly</span>
            <span>Cancel anytime</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-px bg-gray-200 dark:bg-white/10 mb-6" />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-normal text-gray-700 dark:text-white/70 uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>WOLFWHALE <span className="text-gray-400 dark:text-white/30 mx-1">|</span> Learning Management System</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-white/60">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Vancouver, BC, Canada</span>
                  <a href="mailto:info@wolfwhale.ca" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors duration-100"><Mail className="h-3 w-3" /> info@wolfwhale.ca</a>
                  <a href="tel:+13069815926" className="flex items-center gap-1 hover:text-[#00BFFF] transition-colors duration-100"><Phone className="h-3 w-3" /> +1 (306) 981-5926</a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <Link href="/privacy" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors duration-100">
                    Privacy
                  </Link>
                  <Link href="/terms" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors duration-100">
                    Terms
                  </Link>
                  <Link href="/help" className="text-sm text-gray-500 dark:text-white/60 hover:text-[#00BFFF] transition-colors duration-100">
                    Help
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://linkedin.com/company/wolfwhale-learning" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors duration-100" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://x.com/wolfwhale" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-white/40 hover:text-[#00BFFF] transition-colors duration-100" aria-label="X (Twitter)">
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/40">
              &copy; {new Date().getFullYear()} Wolf Whale. All rights reserved. Built in Canada.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        html { scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
        html::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
