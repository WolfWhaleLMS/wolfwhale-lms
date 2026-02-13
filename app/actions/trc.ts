'use server'

export interface TrcCallToAction {
  number: number
  title: string
  description: string
  status: 'addressed' | 'in_progress' | 'not_started'
  checklist: { id: string; label: string; completed: boolean }[]
  evidence: string[]
}

export async function getTrcStatus(): Promise<TrcCallToAction[]> {
  return [
    {
      number: 6,
      title: 'Eliminate Education Gaps',
      description:
        'We call upon the Government of Canada to repeal Section 43 of the Criminal Code of Canada and to eliminate the discrepancy in federal education funding for First Nations children.',
      status: 'not_started',
      checklist: [
        { id: '6-1', label: 'Assess current funding and resource gaps for Indigenous students', completed: false },
        { id: '6-2', label: 'Implement offline/low-bandwidth learning options', completed: false },
        { id: '6-3', label: 'Provide equitable access to learning materials', completed: false },
        { id: '6-4', label: 'Track and report on education outcome metrics', completed: false },
      ],
      evidence: [],
    },
    {
      number: 7,
      title: 'Culturally Appropriate Curricula',
      description:
        'We call upon the Government of Canada to develop culturally appropriate curricula that include courses on Indigenous knowledge systems.',
      status: 'not_started',
      checklist: [
        { id: '7-1', label: 'Review curriculum for Indigenous content integration', completed: false },
        { id: '7-2', label: 'Consult with local Elders and Knowledge Keepers', completed: false },
        { id: '7-3', label: 'Create or adopt culturally relevant course templates', completed: false },
        { id: '7-4', label: 'Train teachers on delivering culturally appropriate content', completed: false },
      ],
      evidence: [],
    },
    {
      number: 8,
      title: 'Indigenous Language Instruction',
      description:
        'We call upon the Government of Canada to provide adequate funding to support Indigenous language revitalization and instruction.',
      status: 'not_started',
      checklist: [
        { id: '8-1', label: 'Identify local Indigenous languages for instruction', completed: false },
        { id: '8-2', label: 'Partner with language speakers and organizations', completed: false },
        { id: '8-3', label: 'Create multimedia language learning resources', completed: false },
        { id: '8-4', label: 'Offer Indigenous language courses in the LMS', completed: false },
      ],
      evidence: [],
    },
    {
      number: 9,
      title: 'Residential Schools History',
      description:
        'We call upon the Government of Canada to make age-appropriate curriculum on residential schools available in all schools.',
      status: 'not_started',
      checklist: [
        { id: '9-1', label: 'Develop age-appropriate residential school history modules', completed: false },
        { id: '9-2', label: 'Include survivor testimonies and primary sources', completed: false },
        { id: '9-3', label: 'Integrate content across relevant grade levels', completed: false },
        { id: '9-4', label: 'Provide teacher support materials and discussion guides', completed: false },
      ],
      evidence: [],
    },
    {
      number: 10,
      title: 'Share Best Practices',
      description:
        'We call upon the Government of Canada to provide adequate funding to enable post-secondary institutions to educate teachers on how to integrate Indigenous knowledge.',
      status: 'not_started',
      checklist: [
        { id: '10-1', label: 'Create a shared resource library for educators', completed: false },
        { id: '10-2', label: 'Enable cross-school collaboration features', completed: false },
        { id: '10-3', label: 'Host or promote professional learning communities', completed: false },
        { id: '10-4', label: 'Document and share successful practices', completed: false },
      ],
      evidence: [],
    },
    {
      number: 11,
      title: 'Teacher Training',
      description:
        'We call upon post-secondary institutions to require all teacher candidates to have courses on Indigenous education topics.',
      status: 'not_started',
      checklist: [
        { id: '11-1', label: 'Provide PD courses on Indigenous knowledge systems', completed: false },
        { id: '11-2', label: 'Track teacher participation in Indigenous education training', completed: false },
        { id: '11-3', label: 'Partner with Indigenous education organizations', completed: false },
        { id: '11-4', label: 'Evaluate teacher competency in culturally responsive teaching', completed: false },
      ],
      evidence: [],
    },
    {
      number: 12,
      title: 'Youth Programs',
      description:
        'We call upon the Government of Canada to develop culturally appropriate early childhood education programs for Indigenous families.',
      status: 'not_started',
      checklist: [
        { id: '12-1', label: 'Support cultural camp and land-based learning programs', completed: false },
        { id: '12-2', label: 'Create youth mentorship program features', completed: false },
        { id: '12-3', label: 'Enable community event organization tools', completed: false },
        { id: '12-4', label: 'Track youth engagement and participation', completed: false },
      ],
      evidence: [],
    },
  ]
}
