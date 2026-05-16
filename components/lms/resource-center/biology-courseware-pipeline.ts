import type { BodyModelAsset, BodySystem } from './human-body'

export type BiologyCoursewareProvider = 'gpt-image-2' | 'Tripo3D' | 'Hunyuan3D' | 'Codex'

export type BiologyCoursewareProductionStep = {
  provider: BiologyCoursewareProvider
  minutes: number
  action: string
  input: string
  output: string
  prompt?: string
}

export type BiologyCoursewareProductionPlan = {
  assetSlug: string
  totalMinutes: number
  steps: BiologyCoursewareProductionStep[]
  modelAssetTemplate: BodyModelAsset
}

function slugFromSystem(system: BodySystem) {
  return system.pipeline[0]?.detail.match(/Generate ([a-z0-9-]+)\.png/)?.[1] ?? system.id
}

export function createBiologyCoursewareProductionPlan(system: BodySystem): BiologyCoursewareProductionPlan {
  const assetSlug = slugFromSystem(system)
  const steps: BiologyCoursewareProductionStep[] = [
    {
      provider: 'gpt-image-2',
      minutes: 20,
      action: 'Generate a 3D-style biology reference image on a flat solid background.',
      input: system.imagePrompt,
      output: `/public/human-body/references/${assetSlug}.png`,
      prompt: system.imagePrompt,
    },
    {
      provider: 'Tripo3D',
      minutes: 30,
      action: 'Generate the first textured GLB candidate from the reference image.',
      input: `/public/human-body/references/${assetSlug}.png`,
      output: `/public/human-body/models/${assetSlug}-tripo.glb`,
    },
    {
      provider: 'Hunyuan3D',
      minutes: 30,
      action: 'Generate the second textured GLB candidate from the same reference image.',
      input: `/public/human-body/references/${assetSlug}.png`,
      output: `/public/human-body/models/${assetSlug}-hunyuan.glb`,
    },
    {
      provider: 'Codex',
      minutes: 30,
      action: 'Select the better GLB, add modelAsset metadata, and verify the Three.js courseware page.',
      input: `/public/human-body/models/${assetSlug}-hunyuan.glb`,
      output: 'components/lms/resource-center/human-body.ts',
    },
  ]

  return {
    assetSlug,
    totalMinutes: steps.reduce((total, step) => total + step.minutes, 0),
    steps,
    modelAssetTemplate: {
      url: `/human-body/models/${assetSlug}-hunyuan.glb`,
      previewUrl: `/human-body/references/${assetSlug}.png`,
      sourceLabel: `Hunyuan3D textured ${system.name} GLB`,
      sourceUrl: `/human-body/models/${assetSlug}-hunyuan.glb`,
      scale: 1,
      exposure: 1.1,
      materialMode: 'native',
    },
  }
}
