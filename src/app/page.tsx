import { redirect } from 'next/navigation';
import { getSession, getUserRole } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    const role = await getUserRole();

    if (!role) {
      redirect('/login');
    }

    switch (role) {
      case 'student':
        redirect('/student/dashboard');
      case 'parent':
        redirect('/parent/dashboard');
      case 'teacher':
        redirect('/teacher/dashboard');
      case 'admin':
        redirect('/admin/dashboard');
      case 'super_admin':
        redirect('/admin/dashboard');
      default:
        redirect('/student/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-aurora-500/20 to-whale-500/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-whale-500/15 to-ocean-500/15 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-aurora-600/10 to-whale-400/10 blur-3xl" />
        <div className="absolute top-2/3 left-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-gold-400/10 to-aurora-400/10 blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-aurora-500 to-whale-500 shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-white"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12C2 7 6 3 12 3s10 4 10 9-4 9-10 9S2 17 2 12Z" />
                  <path d="M12 3c-2 3-3 6-3 9s1 6 3 9" />
                  <path d="M12 3c2 3 3 6 3 9s-1 6-3 9" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-aurora-500 to-whale-500 bg-clip-text text-transparent">
                Wolf Whale LMS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors no-underline hover:bg-white/10 dark:hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-aurora-500 to-whale-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-aurora-500/25 hover:shadow-xl hover:shadow-aurora-500/30 transition-all duration-200 hover:scale-105 no-underline hover:text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-32 sm:pt-28 sm:pb-40">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-aurora-500/20 bg-aurora-500/10 px-4 py-1.5 text-sm font-medium text-aurora-500 dark:text-aurora-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora-500" />
            </span>
            K-12 Learning Reimagined
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-foreground">Where Learning</span>
            <br />
            <span className="bg-gradient-to-r from-aurora-500 via-whale-500 to-ocean-500 bg-clip-text text-transparent">
              Comes Alive
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/60 sm:text-xl">
            A gamified learning management system that turns education into an adventure.
            Students earn XP, raise virtual pets, and level up while mastering their coursework.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aurora-500 to-whale-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-aurora-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-aurora-500/40 hover:scale-105 no-underline hover:text-white"
            >
              Get Started Free
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-foreground/10 bg-white/5 px-8 py-4 text-lg font-bold text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-foreground/20 no-underline hover:text-foreground"
            >
              Sign In
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: 'K-12', label: 'Grade Levels' },
              { value: '100+', label: 'Achievements' },
              { value: '50+', label: 'Virtual Pets' },
              { value: '24/7', label: 'Access' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold bg-gradient-to-r from-aurora-500 to-whale-500 bg-clip-text text-transparent sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-foreground">Everything You Need to </span>
              <span className="bg-gradient-to-r from-whale-500 to-aurora-500 bg-clip-text text-transparent">
                Inspire Learning
              </span>
            </h2>
            <p className="mt-4 text-lg text-foreground/60">
              Powerful tools for teachers, engaging experiences for students, and peace of mind for parents.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Gamification */}
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
              title="XP & Leveling System"
              description="Students earn experience points for completing assignments, participating in discussions, and mastering new skills. Watch them level up and unlock rewards."
              gradient="from-gold-400 to-gold-600"
            />

            {/* Pet System */}
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              }
              title="Virtual Pet Companions"
              description="Each student adopts a virtual pet that grows and evolves based on their learning progress. Feed, play, and nurture pets by staying on top of coursework."
              gradient="from-aurora-400 to-aurora-600"
            />

            {/* Courses */}
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              }
              title="Rich Course Content"
              description="Create engaging lessons with multimedia content, interactive quizzes, and structured modules. Support for all subjects across K-12 grade levels."
              gradient="from-whale-400 to-whale-600"
            />

            {/* Grades & Analytics */}
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              }
              title="Grades & Analytics"
              description="Comprehensive gradebook with real-time analytics. Teachers track progress effortlessly while students and parents stay informed with clear dashboards."
              gradient="from-ocean-400 to-ocean-600"
            />

            {/* Achievements */}
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m5.25-6.389V2.721" />
                </svg>
              }
              title="Achievements & Badges"
              description="Celebrate milestones with a rich achievement system. From first homework submission to semester honors, every accomplishment is recognized and rewarded."
              gradient="from-gold-400 to-aurora-500"
            />

            {/* Multi-role */}
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              }
              title="Built for Everyone"
              description="Dedicated dashboards for students, teachers, parents, and administrators. Each role gets a tailored experience with the tools they need most."
              gradient="from-aurora-500 to-whale-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="text-foreground">How It </span>
              <span className="bg-gradient-to-r from-aurora-500 to-ocean-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="mt-4 text-lg text-foreground/60">
              Getting started is simple. Three steps to transform your classroom.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Sign up as a teacher, student, or parent. Set up your profile and join your school in minutes.',
              },
              {
                step: '02',
                title: 'Explore & Learn',
                description: 'Dive into courses, complete assignments, and earn XP. Your virtual pet grows as you learn.',
              },
              {
                step: '03',
                title: 'Level Up Together',
                description: 'Track progress, earn achievements, and celebrate success. Learning has never been this rewarding.',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-500/20 to-whale-500/20 border border-aurora-500/20">
                  <span className="font-display text-2xl font-bold bg-gradient-to-r from-aurora-500 to-whale-500 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="text-foreground">A Dashboard for </span>
              <span className="bg-gradient-to-r from-whale-500 to-aurora-500 bg-clip-text text-transparent">
                Every Role
              </span>
            </h2>
            <p className="mt-4 text-lg text-foreground/60">
              Tailored experiences designed for the unique needs of each user.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2">
            <RoleCard
              title="Students"
              description="Track XP and levels, care for virtual pets, view assignments, submit work, and earn achievements. A personal dashboard that makes learning feel like a game."
              emoji="&#x1F393;"
              gradient="from-whale-500/10 to-whale-600/10"
              borderColor="border-whale-500/20"
            />
            <RoleCard
              title="Teachers"
              description="Create courses and assignments, manage gradebooks, monitor student engagement, and leverage analytics to identify who needs extra support."
              emoji="&#x1F4DA;"
              gradient="from-aurora-500/10 to-aurora-600/10"
              borderColor="border-aurora-500/20"
            />
            <RoleCard
              title="Parents"
              description="Stay connected to your child's education. View progress reports, grades, and activity at a glance. Receive notifications about important milestones."
              emoji="&#x1F3E0;"
              gradient="from-ocean-500/10 to-ocean-600/10"
              borderColor="border-ocean-500/20"
            />
            <RoleCard
              title="Administrators"
              description="Full platform oversight with user management, school configuration, analytics dashboards, and the tools to keep everything running smoothly."
              emoji="&#x2699;&#xFE0F;"
              gradient="from-gold-500/10 to-gold-600/10"
              borderColor="border-gold-500/20"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            {/* CTA Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-aurora-600 to-whale-600" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />

            <div className="relative px-8 py-16 text-center sm:px-16 sm:py-24">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Transform Your Classroom?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
                Join educators and students who are discovering that learning can be both
                rigorous and genuinely fun. Start your journey today.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-aurora-600 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl no-underline hover:text-aurora-700"
                >
                  Create Free Account
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/50 no-underline hover:text-white"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-aurora-500 to-whale-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-white"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12C2 7 6 3 12 3s10 4 10 9-4 9-10 9S2 17 2 12Z" />
                  <path d="M12 3c-2 3-3 6-3 9s1 6 3 9" />
                  <path d="M12 3c2 3 3 6 3 9s-1 6-3 9" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <span className="font-display text-sm font-semibold text-foreground/60">
                Wolf Whale LMS
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-foreground/40">
              <Link href="/login" className="hover:text-foreground/60 transition-colors no-underline text-foreground/40">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-foreground/60 transition-colors no-underline text-foreground/40">
                Register
              </Link>
            </div>
            <p className="text-sm text-foreground/30">
              &copy; {new Date().getFullYear()} Wolf Whale LMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ==================== Sub-components ==================== */

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="glass-card group relative overflow-hidden p-6 sm:p-8 hover:scale-[1.02]">
      {/* Gradient accent top border */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className={`mb-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/60">{description}</p>
    </div>
  );
}

function RoleCard({
  title,
  description,
  emoji,
  gradient,
  borderColor,
}: {
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  borderColor: string;
}) {
  return (
    <div className={`glass-card relative overflow-hidden p-6 sm:p-8 border ${borderColor}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <div className="relative">
        <span className="text-3xl" dangerouslySetInnerHTML={{ __html: emoji }} />
        <h3 className="mt-4 font-display text-xl font-bold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">{description}</p>
      </div>
    </div>
  );
}
