export type ResourceIconId = 'atom' | 'chemistry' | 'earth' | 'geometry' | 'heart' | 'map' | 'microscope' | 'orbit'

export type LiveInteractiveResource = {
  title: string
  href: string
  status: 'Live'
  area: string
  icon: ResourceIconId
}

export type UpcomingInteractiveResource = {
  title: string
  area: string
  icon: ResourceIconId
}

export const interactiveResources: LiveInteractiveResource[] = [
  {
    title: 'Cell Architecture Studio',
    href: '#cell-architecture-studio',
    status: 'Live',
    area: 'Science: cell structure and function',
    icon: 'microscope',
  },
  {
    title: 'Human Body Studio',
    href: '#human-body-studio',
    status: 'Live',
    area: 'Science: body systems and 3D anatomy',
    icon: 'heart',
  },
  {
    title: 'Solar System Studio',
    href: '#solar-system-studio',
    status: 'Live',
    area: 'Science: Earth and space',
    icon: 'orbit',
  },
  {
    title: 'Fur Trade Routes Map',
    href: '#fur-trade-routes-map',
    status: 'Live',
    area: 'Social Studies: Canada, contact, and trade',
    icon: 'map',
  },
]

export const upcomingResources: UpcomingInteractiveResource[] = [
  { title: 'Chemistry Studio', area: 'Science: matter and reactions', icon: 'chemistry' },
  { title: 'Earth Systems Studio', area: 'Science: land, water, and climate', icon: 'earth' },
  { title: 'Physics Lab Studio', area: 'Science: forces and energy', icon: 'atom' },
  { title: 'Geometry Studio', area: 'Math: shapes and measurement', icon: 'geometry' },
]
