'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Globe, ChevronDown, Mail, Phone, Clock } from 'lucide-react'

type Lang = 'en' | 'fr'

interface FAQItem {
  q: string
  a: string
}

interface FAQSection {
  id: string
  heading: string
  items: FAQItem[]
}

const content = {
  en: {
    title: 'Help Center',
    subtitle: 'Find answers, get support, and make the most of Wolf Whale LMS.',
    backToHome: 'Back to Home',
    quickContactTitle: 'Quick Contact',
    emailLabel: 'Email',
    emailValue: 'info@wolfwhale.ca',
    phoneLabel: 'Phone',
    phoneValue: '+1 (306) 981-5926',
    responseLabel: 'Response Time',
    responseValue: 'Within 24 business hours',
    stillNeedHelp: 'Still need help?',
    stillNeedHelpDesc: 'Our support team is here for you. Send us an email and we\'ll get back to you as soon as possible.',
    contactUs: 'Contact Us',
    sections: [
      {
        id: 'getting-started',
        heading: 'Getting Started',
        items: [
          {
            q: 'How do I sign in?',
            a: 'Use the email and password provided by your school administrator. Go to the login page and enter your credentials. If you\'ve forgotten your password, contact your administrator.',
          },
          {
            q: 'What roles are available?',
            a: 'Wolf Whale LMS supports four user roles: Student, Teacher, Parent, and Admin. Each role has a customized dashboard with relevant tools and features.',
          },
          {
            q: 'Is Wolf Whale available on mobile?',
            a: 'Yes! Wolf Whale LMS is fully responsive and works on smartphones, tablets, and desktop computers through any modern web browser.',
          },
        ],
      },
      {
        id: 'for-students',
        heading: 'For Students',
        items: [
          {
            q: 'How do I view my grades?',
            a: 'Navigate to the Gradebook from your dashboard sidebar. You\'ll see all your courses with current grades, individual assignment scores, and grade trends.',
          },
          {
            q: 'What is XP and how do I earn it?',
            a: 'XP (Experience Points) is part of our gamification system. You earn XP by completing assignments, attending classes, participating in discussions, and achieving milestones. XP helps you level up and earn badges!',
          },
          {
            q: 'How do I use Study Mode?',
            a: 'Click on "Study Mode" in your sidebar. You can create flashcards, take practice quizzes, and use other study tools to prepare for assessments.',
          },
          {
            q: 'What is the Virtual Plaza?',
            a: 'The Virtual Plaza is a fun, interactive space where you can customize your avatar, explore virtual rooms, and connect with classmates in a safe, school-monitored environment.',
          },
        ],
      },
      {
        id: 'for-teachers',
        heading: 'For Teachers',
        items: [
          {
            q: 'How do I create a course?',
            a: 'Go to your dashboard and click "Create Course." Fill in the course details (name, subject, grade level, description) and you\'re ready to start adding content.',
          },
          {
            q: 'How do I grade assignments?',
            a: 'Open the course, navigate to the assignment, and click on student submissions. You can enter grades, leave feedback, and publish results to students and parents.',
          },
          {
            q: 'How do I take attendance?',
            a: 'Open your course and select "Attendance." You can mark students as present, absent, tardy, or excused for each class session.',
          },
        ],
      },
      {
        id: 'for-parents',
        heading: 'For Parents',
        items: [
          {
            q: 'How do I see my child\'s progress?',
            a: 'Log in with your parent credentials and you\'ll see your child\'s dashboard with grades, attendance, upcoming assignments, and teacher messages.',
          },
          {
            q: 'How do I contact my child\'s teacher?',
            a: 'Use the messaging feature in your dashboard to send messages directly to your child\'s teachers.',
          },
        ],
      },
      {
        id: 'for-administrators',
        heading: 'For Administrators',
        items: [
          {
            q: 'How do I add users?',
            a: 'Go to Admin Dashboard > User Management. You can add users individually or import them in bulk via CSV file.',
          },
          {
            q: 'How do I manage courses?',
            a: 'Navigate to Admin Dashboard > Course Management. You can create courses, assign teachers, enroll students, and manage schedules.',
          },
          {
            q: 'How do I view school analytics?',
            a: 'Your Admin Dashboard home page shows key metrics. For detailed reports, visit Analytics in the sidebar.',
          },
        ],
      },
      {
        id: 'technical-support',
        heading: 'Technical Support',
        items: [
          {
            q: 'What browsers are supported?',
            a: 'Wolf Whale LMS works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser up to date.',
          },
          {
            q: 'I\'m experiencing a technical issue. What should I do?',
            a: 'First, try refreshing the page or clearing your browser cache. If the issue persists, contact your school administrator or email us at info@wolfwhale.ca with a description of the problem.',
          },
          {
            q: 'Is my data secure?',
            a: 'Yes. Wolf Whale uses enterprise-grade encryption, row-level security, and multi-tenant architecture to protect all data. See our Privacy Policy for full details.',
          },
        ],
      },
    ] as FAQSection[],
  },
  fr: {
    title: 'Centre d\'aide',
    subtitle: 'Trouvez des r\u00e9ponses, obtenez de l\'aide et tirez le meilleur parti de Wolf Whale LMS.',
    backToHome: 'Retour \u00e0 l\u2019accueil',
    quickContactTitle: 'Contact rapide',
    emailLabel: 'Courriel',
    emailValue: 'info@wolfwhale.ca',
    phoneLabel: 'T\u00e9l\u00e9phone',
    phoneValue: '+1 (306) 981-5926',
    responseLabel: 'D\u00e9lai de r\u00e9ponse',
    responseValue: 'Dans les 24 heures ouvrables',
    stillNeedHelp: 'Vous avez encore besoin d\'aide\u00a0?',
    stillNeedHelpDesc: 'Notre \u00e9quipe de soutien est l\u00e0 pour vous. Envoyez-nous un courriel et nous vous r\u00e9pondrons dans les plus brefs d\u00e9lais.',
    contactUs: 'Nous contacter',
    sections: [
      {
        id: 'getting-started',
        heading: 'Pour commencer',
        items: [
          {
            q: 'Comment puis-je me connecter\u00a0?',
            a: 'Utilisez l\'adresse courriel et le mot de passe fournis par l\'administrateur de votre \u00e9cole. Rendez-vous sur la page de connexion et entrez vos identifiants. Si vous avez oubli\u00e9 votre mot de passe, contactez votre administrateur.',
          },
          {
            q: 'Quels r\u00f4les sont disponibles\u00a0?',
            a: 'Wolf Whale LMS prend en charge quatre r\u00f4les d\'utilisateur\u00a0: \u00c9l\u00e8ve, Enseignant, Parent et Administrateur. Chaque r\u00f4le dispose d\'un tableau de bord personnalis\u00e9 avec des outils et fonctionnalit\u00e9s pertinents.',
          },
          {
            q: 'Wolf Whale est-il disponible sur mobile\u00a0?',
            a: 'Oui\u00a0! Wolf Whale LMS est enti\u00e8rement adaptatif et fonctionne sur les t\u00e9l\u00e9phones intelligents, les tablettes et les ordinateurs de bureau via tout navigateur Web moderne.',
          },
        ],
      },
      {
        id: 'for-students',
        heading: 'Pour les \u00e9l\u00e8ves',
        items: [
          {
            q: 'Comment puis-je consulter mes notes\u00a0?',
            a: 'Acc\u00e9dez au carnet de notes depuis la barre lat\u00e9rale de votre tableau de bord. Vous verrez tous vos cours avec les notes actuelles, les scores de chaque devoir et les tendances de vos r\u00e9sultats.',
          },
          {
            q: 'Qu\'est-ce que les XP et comment en gagner\u00a0?',
            a: 'Les XP (points d\'exp\u00e9rience) font partie de notre syst\u00e8me de ludification. Vous gagnez des XP en compl\u00e9tant des devoirs, en assistant aux cours, en participant aux discussions et en atteignant des jalons. Les XP vous aident \u00e0 monter de niveau et \u00e0 obtenir des badges\u00a0!',
          },
          {
            q: 'Comment utiliser le mode \u00e9tude\u00a0?',
            a: 'Cliquez sur \u00ab\u00a0Mode \u00e9tude\u00a0\u00bb dans votre barre lat\u00e9rale. Vous pouvez cr\u00e9er des cartes m\u00e9moire, passer des quiz d\'entra\u00eenement et utiliser d\'autres outils d\'\u00e9tude pour pr\u00e9parer vos \u00e9valuations.',
          },
          {
            q: 'Qu\'est-ce que la Plaza virtuelle\u00a0?',
            a: 'La Plaza virtuelle est un espace interactif et amusant o\u00f9 vous pouvez personnaliser votre avatar, explorer des salles virtuelles et communiquer avec vos camarades de classe dans un environnement s\u00e9curis\u00e9 et supervis\u00e9 par l\'\u00e9cole.',
          },
        ],
      },
      {
        id: 'for-teachers',
        heading: 'Pour les enseignants',
        items: [
          {
            q: 'Comment cr\u00e9er un cours\u00a0?',
            a: 'Allez sur votre tableau de bord et cliquez sur \u00ab\u00a0Cr\u00e9er un cours\u00a0\u00bb. Remplissez les d\u00e9tails du cours (nom, mati\u00e8re, niveau scolaire, description) et vous \u00eates pr\u00eat \u00e0 ajouter du contenu.',
          },
          {
            q: 'Comment noter les devoirs\u00a0?',
            a: 'Ouvrez le cours, acc\u00e9dez au devoir et cliquez sur les soumissions des \u00e9l\u00e8ves. Vous pouvez entrer des notes, laisser des commentaires et publier les r\u00e9sultats aux \u00e9l\u00e8ves et aux parents.',
          },
          {
            q: 'Comment prendre les pr\u00e9sences\u00a0?',
            a: 'Ouvrez votre cours et s\u00e9lectionnez \u00ab\u00a0Pr\u00e9sences\u00a0\u00bb. Vous pouvez marquer les \u00e9l\u00e8ves comme pr\u00e9sents, absents, en retard ou excus\u00e9s pour chaque s\u00e9ance de cours.',
          },
        ],
      },
      {
        id: 'for-parents',
        heading: 'Pour les parents',
        items: [
          {
            q: 'Comment voir les progr\u00e8s de mon enfant\u00a0?',
            a: 'Connectez-vous avec vos identifiants de parent et vous verrez le tableau de bord de votre enfant avec ses notes, ses pr\u00e9sences, ses devoirs \u00e0 venir et les messages de ses enseignants.',
          },
          {
            q: 'Comment contacter l\'enseignant de mon enfant\u00a0?',
            a: 'Utilisez la fonctionnalit\u00e9 de messagerie dans votre tableau de bord pour envoyer des messages directement aux enseignants de votre enfant.',
          },
        ],
      },
      {
        id: 'for-administrators',
        heading: 'Pour les administrateurs',
        items: [
          {
            q: 'Comment ajouter des utilisateurs\u00a0?',
            a: 'Allez dans Tableau de bord administratif > Gestion des utilisateurs. Vous pouvez ajouter des utilisateurs individuellement ou les importer en masse via un fichier CSV.',
          },
          {
            q: 'Comment g\u00e9rer les cours\u00a0?',
            a: 'Acc\u00e9dez \u00e0 Tableau de bord administratif > Gestion des cours. Vous pouvez cr\u00e9er des cours, assigner des enseignants, inscrire des \u00e9l\u00e8ves et g\u00e9rer les horaires.',
          },
          {
            q: 'Comment consulter les analyses de l\'\u00e9cole\u00a0?',
            a: 'La page d\'accueil de votre tableau de bord administratif affiche les indicateurs cl\u00e9s. Pour des rapports d\u00e9taill\u00e9s, consultez la section Analyses dans la barre lat\u00e9rale.',
          },
        ],
      },
      {
        id: 'technical-support',
        heading: 'Soutien technique',
        items: [
          {
            q: 'Quels navigateurs sont pris en charge\u00a0?',
            a: 'Wolf Whale LMS fonctionne de mani\u00e8re optimale avec les derni\u00e8res versions de Chrome, Firefox, Safari et Edge. Nous recommandons de garder votre navigateur \u00e0 jour.',
          },
          {
            q: 'J\'ai un probl\u00e8me technique. Que dois-je faire\u00a0?',
            a: 'Essayez d\'abord de rafra\u00eechir la page ou de vider le cache de votre navigateur. Si le probl\u00e8me persiste, contactez l\'administrateur de votre \u00e9cole ou envoyez-nous un courriel \u00e0 info@wolfwhale.ca avec une description du probl\u00e8me.',
          },
          {
            q: 'Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es\u00a0?',
            a: 'Oui. Wolf Whale utilise un chiffrement de niveau entreprise, la s\u00e9curit\u00e9 au niveau des lignes et une architecture multi-locataire pour prot\u00e9ger toutes les donn\u00e9es. Consultez notre Politique de confidentialit\u00e9 pour tous les d\u00e9tails.',
          },
        ],
      },
    ] as FAQSection[],
  },
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#0A2540]/10 rounded-xl overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#0A2540]/[0.03] transition-colors"
      >
        <span className="font-semibold text-[#0A2540] text-sm sm:text-base">{item.q}</span>
        <ChevronDown
          className={`h-5 w-5 text-[#00BFFF] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 text-sm sm:text-base text-[#0A2540]/70 leading-relaxed">
          {item.a}
        </div>
      </div>
    </div>
  )
}

export default function HelpCenterPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [mounted, setMounted] = useState(false)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  const t = content[lang]

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f0f4f8]">
      {/* Light Ocean Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #E8F8FF 0%, #D0F0FF 25%, #B0E8FF 50%, #D0F0FF 75%, #E8F8FF 100%)',
          }}
        />

        {/* Ambient teal glow */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 150% 80% at 50% 20%, rgba(20,184,166,0.15) 0%, transparent 60%)',
            animation: 'ocean-pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 120% 60% at 30% 70%, rgba(26,42,78,0.08) 0%, transparent 50%)',
            animation: 'ocean-drift 12s ease-in-out infinite',
          }}
        />

        {/* Floating particles */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'rgba(26,42,78,0.12)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle 4s ease-in-out infinite ${Math.random() * 5}s`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#0A2540]/10 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Wolf Whale"
              width={48}
              height={48}
              className="rounded-xl object-contain shadow-lg border-2 border-black"
            />
            <div>
              <span className="text-lg sm:text-xl font-display font-bold text-[#0A2540] group-hover:text-[#00BFFF] transition-colors block tracking-wider uppercase">
                Wolf Whale
              </span>
              <span className="text-xs text-[#0A2540]/60 block font-display font-semibold tracking-widest uppercase">
                Learning Management System
              </span>
            </div>
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Globe className="h-4 w-4 text-[#0A2540]/50 hidden sm:block" />
            <div className="flex rounded-lg border border-[#0A2540]/20 overflow-hidden">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-[#0A2540] to-[#00BFFF] text-white'
                    : 'text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-[#0A2540]/5'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  lang === 'fr'
                    ? 'bg-gradient-to-r from-[#0A2540] to-[#00BFFF] text-white'
                    : 'text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-[#0A2540]/5'
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0A2540]/50 hover:text-[#00BFFF] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToHome}
        </Link>

        {/* Hero Section */}
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A2540] mb-3">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-[#0A2540]/70 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Quick Contact Card */}
        <div className="liquid-glass rounded-2xl p-6 sm:p-8 border border-[#0A2540]/10 mb-10 sm:mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-[#0A2540] mb-5">
            {t.quickContactTitle}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#00BFFF]/10 flex-shrink-0">
                <Mail className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0A2540]/70">{t.emailLabel}</p>
                <a
                  href="mailto:info@wolfwhale.ca"
                  className="text-[#00BFFF] font-semibold hover:underline"
                >
                  {t.emailValue}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#00BFFF]/10 flex-shrink-0">
                <Phone className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0A2540]/70">{t.phoneLabel}</p>
                <a
                  href="tel:+13069815926"
                  className="text-[#00BFFF] font-semibold hover:underline"
                >
                  {t.phoneValue}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#00BFFF]/10 flex-shrink-0">
                <Clock className="h-5 w-5 text-[#00BFFF]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0A2540]/70">{t.responseLabel}</p>
                <p className="text-[#0A2540] font-semibold">{t.responseValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10 sm:space-y-12">
          {t.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A2540] mb-4 sm:mb-5 border-b border-[#0A2540]/10 pb-3">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, idx) => {
                  const key = `${section.id}-${idx}`
                  return (
                    <div key={key} className="liquid-glass rounded-xl">
                      <AccordionItem
                        item={item}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggleItem(key)}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Still Need Help CTA */}
        <div className="mt-12 sm:mt-16 liquid-glass rounded-2xl p-8 sm:p-10 border border-[#0A2540]/10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2540] mb-3">
            {t.stillNeedHelp}
          </h2>
          <p className="text-[#0A2540]/70 mb-6 max-w-lg mx-auto">
            {t.stillNeedHelpDesc}
          </p>
          <a
            href="mailto:info@wolfwhale.ca"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0A2540] to-[#00BFFF] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <Mail className="h-5 w-5" />
            {t.contactUs}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#0A2540]/10 mt-16 sm:mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#0A2540]/40">
              &copy; 2026 Wolf Whale LMS.{' '}
              {lang === 'en' ? 'All rights reserved.' : 'Tous droits r\u00e9serv\u00e9s.'}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-[#0A2540]/50 hover:text-[#00BFFF] transition-colors"
              >
                {lang === 'en' ? 'Privacy' : 'Confidentialit\u00e9'}
              </Link>
              <Link
                href="/terms"
                className="text-sm text-[#0A2540]/50 hover:text-[#00BFFF] transition-colors"
              >
                {lang === 'en' ? 'Terms' : 'Conditions'}
              </Link>
              <Link
                href="/help"
                className="text-sm text-[#00BFFF] font-medium"
              >
                {lang === 'en' ? 'Help' : 'Aide'}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes ocean-pulse {
          0%,
          100% {
            transform: scale(1) translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.1) translateY(-5%);
            opacity: 0.5;
          }
        }
        @keyframes ocean-drift {
          0%,
          100% {
            transform: translateX(0) scale(1);
          }
          50% {
            transform: translateX(10%) scale(1.05);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  )
}
