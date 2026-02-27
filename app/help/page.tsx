import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Clock } from 'lucide-react'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { FAQAccordion } from '@/components/ui/FAQAccordion'

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
    subtitle: 'Find answers, get support, and make the most of WolfWhale LMS.',
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
            a: 'WolfWhale LMS supports four user roles: Student, Teacher, Parent, and Admin. Each role has a customized dashboard with relevant tools and features.',
          },
          {
            q: 'Is WolfWhale available on mobile?',
            a: 'Yes! WolfWhale LMS is fully responsive and works on smartphones, tablets, and desktop computers through any modern web browser.',
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
            a: 'WolfWhale LMS works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser up to date.',
          },
          {
            q: 'I\'m experiencing a technical issue. What should I do?',
            a: 'First, try refreshing the page or clearing your browser cache. If the issue persists, contact your school administrator or email us at info@wolfwhale.ca with a description of the problem.',
          },
          {
            q: 'Is my data secure?',
            a: 'Yes. WolfWhale uses enterprise-grade encryption, row-level security, and multi-tenant architecture to protect all data. See our Privacy Policy for full details.',
          },
        ],
      },
    ] as FAQSection[],
  },
  fr: {
    title: 'Centre d\'aide',
    subtitle: 'Trouvez des réponses, obtenez de l\'aide et tirez le meilleur parti de WolfWhale LMS.',
    backToHome: 'Retour à l\u2019accueil',
    quickContactTitle: 'Contact rapide',
    emailLabel: 'Courriel',
    emailValue: 'info@wolfwhale.ca',
    phoneLabel: 'Téléphone',
    phoneValue: '+1 (306) 981-5926',
    responseLabel: 'Délai de réponse',
    responseValue: 'Dans les 24 heures ouvrables',
    stillNeedHelp: 'Vous avez encore besoin d\'aide\u00a0?',
    stillNeedHelpDesc: 'Notre équipe de soutien est là pour vous. Envoyez-nous un courriel et nous vous répondrons dans les plus brefs délais.',
    contactUs: 'Nous contacter',
    sections: [
      {
        id: 'getting-started',
        heading: 'Pour commencer',
        items: [
          {
            q: 'Comment puis-je me connecter\u00a0?',
            a: 'Utilisez l\'adresse courriel et le mot de passe fournis par l\'administrateur de votre école. Rendez-vous sur la page de connexion et entrez vos identifiants. Si vous avez oublié votre mot de passe, contactez votre administrateur.',
          },
          {
            q: 'Quels rôles sont disponibles\u00a0?',
            a: 'WolfWhale LMS prend en charge quatre rôles d\'utilisateur\u00a0: Élève, Enseignant, Parent et Administrateur. Chaque rôle dispose d\'un tableau de bord personnalisé avec des outils et fonctionnalités pertinents.',
          },
          {
            q: 'WolfWhale est-il disponible sur mobile\u00a0?',
            a: 'Oui\u00a0! WolfWhale LMS est entièrement adaptatif et fonctionne sur les téléphones intelligents, les tablettes et les ordinateurs de bureau via tout navigateur Web moderne.',
          },
        ],
      },
      {
        id: 'for-students',
        heading: 'Pour les élèves',
        items: [
          {
            q: 'Comment puis-je consulter mes notes\u00a0?',
            a: 'Accédez au carnet de notes depuis la barre latérale de votre tableau de bord. Vous verrez tous vos cours avec les notes actuelles, les scores de chaque devoir et les tendances de vos résultats.',
          },
        ],
      },
      {
        id: 'for-teachers',
        heading: 'Pour les enseignants',
        items: [
          {
            q: 'Comment créer un cours\u00a0?',
            a: 'Allez sur votre tableau de bord et cliquez sur \u00ab\u00a0Créer un cours\u00a0\u00bb. Remplissez les détails du cours (nom, matière, niveau scolaire, description) et vous êtes prêt à ajouter du contenu.',
          },
          {
            q: 'Comment noter les devoirs\u00a0?',
            a: 'Ouvrez le cours, accédez au devoir et cliquez sur les soumissions des élèves. Vous pouvez entrer des notes, laisser des commentaires et publier les résultats aux élèves et aux parents.',
          },
          {
            q: 'Comment prendre les présences\u00a0?',
            a: 'Ouvrez votre cours et sélectionnez \u00ab\u00a0Présences\u00a0\u00bb. Vous pouvez marquer les élèves comme présents, absents, en retard ou excusés pour chaque séance de cours.',
          },
        ],
      },
      {
        id: 'for-parents',
        heading: 'Pour les parents',
        items: [
          {
            q: 'Comment voir les progrès de mon enfant\u00a0?',
            a: 'Connectez-vous avec vos identifiants de parent et vous verrez le tableau de bord de votre enfant avec ses notes, ses présences, ses devoirs à venir et les messages de ses enseignants.',
          },
          {
            q: 'Comment contacter l\'enseignant de mon enfant\u00a0?',
            a: 'Utilisez la fonctionnalité de messagerie dans votre tableau de bord pour envoyer des messages directement aux enseignants de votre enfant.',
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
            q: 'Comment gérer les cours\u00a0?',
            a: 'Accédez à Tableau de bord administratif > Gestion des cours. Vous pouvez créer des cours, assigner des enseignants, inscrire des élèves et gérer les horaires.',
          },
          {
            q: 'Comment consulter les analyses de l\'école\u00a0?',
            a: 'La page d\'accueil de votre tableau de bord administratif affiche les indicateurs clés. Pour des rapports détaillés, consultez la section Analyses dans la barre latérale.',
          },
        ],
      },
      {
        id: 'technical-support',
        heading: 'Soutien technique',
        items: [
          {
            q: 'Quels navigateurs sont pris en charge\u00a0?',
            a: 'WolfWhale LMS fonctionne de manière optimale avec les dernières versions de Chrome, Firefox, Safari et Edge. Nous recommandons de garder votre navigateur à jour.',
          },
          {
            q: 'J\'ai un problème technique. Que dois-je faire\u00a0?',
            a: 'Essayez d\'abord de rafraîchir la page ou de vider le cache de votre navigateur. Si le problème persiste, contactez l\'administrateur de votre école ou envoyez-nous un courriel à info@wolfwhale.ca avec une description du problème.',
          },
          {
            q: 'Mes données sont-elles sécurisées\u00a0?',
            a: 'Oui. WolfWhale utilise un chiffrement de niveau entreprise, la sécurité au niveau des lignes et une architecture multi-locataire pour protéger toutes les données. Consultez notre Politique de confidentialité pour tous les détails.',
          },
        ],
      },
    ] as FAQSection[],
  },
}

interface PageProps {
  searchParams: Promise<{ lang?: string }>
}

export default async function HelpCenterPage({ searchParams }: PageProps) {
  const params = await searchParams
  const lang: Lang = params.lang === 'fr' ? 'fr' : 'en'
  const t = content[lang]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Corinthian Pillar Borders */}
      <div className="fixed top-[15px] -bottom-[60px] left-0 w-[80px] sm:w-[130px] md:w-[190px] lg:w-[260px] z-[5] pointer-events-none" aria-hidden="true">
        <img src="/pillar.jpg" alt="" className="block w-full h-full object-cover object-top mix-blend-multiply dark:mix-blend-lighten dark:invert opacity-90 dark:opacity-40" />
      </div>
      <div className="fixed top-[15px] -bottom-[60px] right-0 w-[80px] sm:w-[130px] md:w-[190px] lg:w-[260px] z-[5] pointer-events-none" style={{ transform: 'scaleX(-1)' }} aria-hidden="true">
        <img src="/pillar.jpg" alt="" className="block w-full h-full object-cover object-top mix-blend-multiply dark:mix-blend-lighten dark:invert opacity-90 dark:opacity-40" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="WolfWhale"
              width={48}
              height={48}
              sizes="48px"
              className="rounded-xl object-contain shadow-lg border-2 border-black dark:border-white/10"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-display font-bold text-gray-900 dark:text-white group-hover:opacity-70 transition-opacity tracking-wider uppercase">
                WolfWhale
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-white/50 font-display font-semibold tracking-widest uppercase">Learning Management System</p>
            </div>
          </Link>

          {/* Language Toggle (client component) */}
          <LanguageToggle lang={lang} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToHome}
        </Link>

        {/* Hero Section */}
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Quick Contact Card */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-10 sm:mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5">
            {t.quickContactTitle}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 flex-shrink-0">
                <Mail className="h-5 w-5 text-gray-600 dark:text-white/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-white/50">{t.emailLabel}</p>
                <a
                  href="mailto:info@wolfwhale.ca"
                  className="text-gray-900 dark:text-white font-semibold hover:opacity-70 transition-opacity"
                >
                  {t.emailValue}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 flex-shrink-0">
                <Phone className="h-5 w-5 text-gray-600 dark:text-white/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-white/50">{t.phoneLabel}</p>
                <a
                  href="tel:+13069815926"
                  className="text-gray-900 dark:text-white font-semibold hover:opacity-70 transition-opacity"
                >
                  {t.phoneValue}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-600 dark:text-white/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-white/50">{t.responseLabel}</p>
                <p className="text-gray-900 dark:text-white font-semibold">{t.responseValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Sections (client component for accordion interactivity) */}
        <FAQAccordion sections={t.sections} />

        {/* Still Need Help CTA */}
        <div className="mt-12 sm:mt-16 rounded-2xl p-8 sm:p-10 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t.stillNeedHelp}
          </h2>
          <p className="text-gray-600 dark:text-white/70 mb-6 max-w-lg mx-auto">
            {t.stillNeedHelpDesc}
          </p>
          <a
            href="mailto:info@wolfwhale.ca"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <Mail className="h-5 w-5" />
            {t.contactUs}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/5 mt-16 sm:mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 dark:text-white/30">
              &copy; 2026 WolfWhale LMS.{' '}
              {lang === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
            </p>
            <div className="flex gap-6">
              <Link
                href={`/privacy?lang=${lang}`}
                className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {lang === 'en' ? 'Privacy' : 'Confidentialité'}
              </Link>
              <Link
                href={`/terms?lang=${lang}`}
                className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {lang === 'en' ? 'Terms' : 'Conditions'}
              </Link>
              <Link
                href={`/help?lang=${lang}`}
                className="text-sm text-gray-900 dark:text-white font-medium"
              >
                {lang === 'en' ? 'Help' : 'Aide'}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
