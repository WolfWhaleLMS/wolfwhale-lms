import { describe, expect, it } from 'vitest'

import { createBiologyCoursewareProductionPlan } from '@/components/lms/resource-center/biology-courseware-pipeline'
import { getBodySystemById } from '@/components/lms/resource-center/human-body'

describe('biology image-to-3D courseware pipeline', () => {
  it('turns a body system into a reusable two-hour production plan', () => {
    const plan = createBiologyCoursewareProductionPlan(getBodySystemById('circulatory'))

    expect(plan.totalMinutes).toBeLessThanOrEqual(120)
    expect(plan.assetSlug).toBe('heart-circulation')
    expect(plan.steps.map((step) => step.provider)).toEqual(['gpt-image-2', 'Tripo3D', 'Hunyuan3D', 'Codex'])
    expect(plan.steps[0].output).toBe('/public/human-body/references/heart-circulation.png')
    expect(plan.steps[1].output).toBe('/public/human-body/models/heart-circulation-tripo.glb')
    expect(plan.steps[2].output).toBe('/public/human-body/models/heart-circulation-hunyuan.glb')
    expect(plan.steps[3].output).toBe('components/lms/resource-center/human-body.ts')
    expect(plan.steps[0].prompt).toContain('solid deep teal background')
    expect(plan.modelAssetTemplate.url).toBe('/human-body/models/heart-circulation-hunyuan.glb')
  })
})
