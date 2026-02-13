'use client'

import { useState } from 'react'
import {
  Globe,
  Users,
  FileText,
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Feather,
  Heart,
} from 'lucide-react'
import { toast } from 'sonner'

/* ============================================
   Data — TRC Calls to Action #6-#12
   ============================================ */
interface TRCCall {
  number: number
  title: string
  description: string
  support: string
}

const TRC_CALLS: TRCCall[] = [
  {
    number: 6,
    title: 'Eliminate Education Gaps',
    description:
      'Addressing funding gaps and providing equitable learning resources for Indigenous students.',
    support:
      'Offline learning mode for remote/rural communities with limited internet access.',
  },
  {
    number: 7,
    title: 'Culturally Appropriate Curricula',
    description:
      'Developing courses and learning materials that integrate Indigenous knowledge systems.',
    support:
      'Flexible course builder with templates for culturally relevant content creation.',
  },
  {
    number: 8,
    title: 'Indigenous Language Instruction',
    description:
      'Supporting the revitalization and instruction of Indigenous languages.',
    support:
      'Multimedia lesson tools for language instruction including audio, video, and interactive exercises.',
  },
  {
    number: 9,
    title: 'Residential Schools History',
    description:
      'Ensuring age-appropriate education about residential schools and their lasting impacts.',
    support:
      'Interactive course modules with age-appropriate content on residential school history.',
  },
  {
    number: 10,
    title: 'Share Best Practices',
    description:
      'Enabling educators to share effective approaches to Indigenous education.',
    support:
      'Community content sharing platform and collaboration tools for educators.',
  },
  {
    number: 11,
    title: 'Teacher Training',
    description:
      'Professional development for educators on Indigenous knowledge and teaching methods.',
    support:
      'PD course templates and tracking for Indigenous education professional development.',
  },
  {
    number: 12,
    title: 'Youth Programs',
    description:
      'Supporting programs that connect youth with cultural traditions and education.',
    support:
      'Tools for organizing and managing cultural camps and youth education initiatives.',
  },
]

/* ============================================
   Data — Cultural Resources
   ============================================ */
interface CulturalResource {
  icon: typeof Globe
  title: string
  description: string
  link?: string
  linkLabel?: string
}

const CULTURAL_RESOURCES: CulturalResource[] = [
  {
    icon: Globe,
    title: 'Land Acknowledgments',
    description:
      'Templates and guidance for creating meaningful land acknowledgments for your school community.',
  },
  {
    icon: Users,
    title: 'Elder Teachings',
    description:
      'Video and audio recordings of Elder teachings and traditional knowledge sharing sessions.',
  },
  {
    icon: FileText,
    title: 'Historical Documents',
    description:
      'Key historical documents including the TRC Final Report, Royal Commission on Aboriginal Peoples, and treaty texts.',
    link: 'https://nctr.ca',
    linkLabel: 'Visit NCTR',
  },
  {
    icon: Calendar,
    title: 'Cultural Calendars',
    description:
      'Important dates including National Indigenous Peoples Day (June 21), Orange Shirt Day (September 30), and more.',
  },
  {
    icon: BookOpen,
    title: 'Language Resources',
    description:
      'Resources for Indigenous language revitalization including links to FirstVoices.com and language learning tools.',
    link: 'https://www.firstvoices.com',
    linkLabel: 'Visit FirstVoices',
  },
  {
    icon: BookOpen,
    title: 'Recommended Reading',
    description:
      'Curated reading lists for educators and students on Indigenous history, culture, and reconciliation.',
  },
]

/* ============================================
   Data — Curriculum Templates
   ============================================ */
interface CurriculumTemplate {
  title: string
  gradeRange: string
  modules: number
  description: string
}

const CURRICULUM_TEMPLATES: CurriculumTemplate[] = [
  {
    title: 'Residential Schools History',
    gradeRange: 'Grade 7-12',
    modules: 8,
    description:
      'A comprehensive course covering the history, impacts, and legacy of residential schools in Canada.',
  },
  {
    title: 'Treaty Education',
    gradeRange: 'Grade 4-12',
    modules: 6,
    description:
      'Understanding the significance of treaties, treaty rights, and the relationship between Indigenous and non-Indigenous peoples.',
  },
  {
    title: 'Indigenous Art & Culture',
    gradeRange: 'Grade K-12',
    modules: 10,
    description:
      'Exploring traditional and contemporary Indigenous art forms, cultural practices, and artistic expression.',
  },
  {
    title: 'Indigenous Science & Land-Based Learning',
    gradeRange: 'Grade 5-12',
    modules: 7,
    description:
      'Integrating traditional ecological knowledge with Western science through land-based learning experiences.',
  },
  {
    title: 'Indigenous Literature',
    gradeRange: 'Grade 6-12',
    modules: 8,
    description:
      'A curated collection of Indigenous stories, poetry, oral traditions, and contemporary Indigenous authors.',
  },
  {
    title: 'Reconciliation in Action',
    gradeRange: 'Grade 9-12',
    modules: 5,
    description:
      'Examining contemporary reconciliation efforts, allyship, and taking meaningful action in communities.',
  },
]

/* ============================================
   Tab type
   ============================================ */
type TabKey = 'trc' | 'resources' | 'curriculum'

/* ============================================
   TRC Card Component
   ============================================ */
function TRCCard({ call }: { call: TRCCall }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="ocean-card rounded-2xl border-l-4 border-[#D97706] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        {/* Number badge */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D97706] text-white font-bold text-sm shadow-md">
          {call.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-foreground">
              {call.title}
            </h3>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Not Started
            </span>
          </div>

          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {call.description}
          </p>

          {/* Expandable support section */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#D97706] hover:text-[#C2410C] transition-colors"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform" />
            )}
            How WolfWhale Supports This
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded-xl bg-[#FEF3C7]/50 dark:bg-[#78350F]/20 p-4 text-sm text-[#78350F] dark:text-[#FDE68A] leading-relaxed flex items-start gap-2">
              <Heart className="h-4 w-4 shrink-0 mt-0.5 text-[#D97706]" />
              {call.support}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Cultural Resource Card Component
   ============================================ */
function ResourceCard({ resource }: { resource: CulturalResource }) {
  const Icon = resource.icon

  return (
    <div className="ocean-card rounded-2xl p-5 sm:p-6 group transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] dark:bg-[#78350F]/30">
          <Icon className="h-5 w-5 text-[#D97706]" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{resource.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {resource.description}
          </p>

          <div className="mt-3">
            {resource.link ? (
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D97706] hover:text-[#C2410C] transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {resource.linkLabel}
              </a>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-semibold text-[#D97706]">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   Curriculum Template Card Component
   ============================================ */
function TemplateCard({ template }: { template: CurriculumTemplate }) {
  return (
    <div className="ocean-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-lg text-foreground">
          {template.title}
        </h3>
        <span className="shrink-0 rounded-full bg-[#FEF3C7] text-[#78350F] text-xs font-semibold px-2 py-0.5">
          {template.gradeRange}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {template.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {template.modules} modules
        </span>
        <button
          onClick={() =>
            toast('Coming soon! Template adoption will be available in a future update.')
          }
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#D97706] px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-[#C2410C] hover:shadow-lg transition-all"
        >
          <Feather className="h-3.5 w-3.5" />
          Adopt Template
        </button>
      </div>
    </div>
  )
}

/* ============================================
   Main PortalTabs Component
   ============================================ */
export function PortalTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('trc')

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'trc', label: 'TRC Calls to Action' },
    { key: 'resources', label: 'Cultural Resources' },
    { key: 'curriculum', label: 'Curriculum Templates' },
  ]

  return (
    <div className="space-y-6">
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-[#D97706] text-white shadow-md'
                : 'bg-[#FEF3C7] text-[#78350F] hover:bg-[#FDE68A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'trc' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 rounded-full bg-[#D97706]" />
            <h2 className="text-2xl font-bold text-foreground">
              Calls to Action #6 &ndash; #12: Education
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
            The Truth and Reconciliation Commission identified 94 Calls to Action.
            Calls #6 through #12 focus specifically on education and are central to
            WolfWhale&apos;s mission of supporting Indigenous learners and educators.
          </p>
          <div className="grid gap-4">
            {TRC_CALLS.map((call) => (
              <TRCCard key={call.number} call={call} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 rounded-full bg-[#D97706]" />
            <h2 className="text-2xl font-bold text-foreground">
              Cultural Resources
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
            A curated collection of resources to support educators and students in
            learning about Indigenous cultures, histories, and perspectives.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CULTURAL_RESOURCES.map((resource) => (
              <ResourceCard key={resource.title} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 rounded-full bg-[#D97706]" />
            <h2 className="text-2xl font-bold text-foreground">
              Curriculum Templates
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
            Ready-to-adopt course templates developed in consultation with Indigenous
            educators. Adopt a template to create a fully structured course in your LMS.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CURRICULUM_TEMPLATES.map((template) => (
              <TemplateCard key={template.title} template={template} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
