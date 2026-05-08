import { StudentCompanionWidget } from '@/components/lms/StudentCompanionWidget'
import { StudentThemeSettings } from '@/components/lms/StudentThemeSettings'

import { StudentWorkspaceShell } from './shared'

export function StudentSettingsWorkspace() {
  return (
    <StudentWorkspaceShell title="Student settings" subtitle="Personalize the student dashboard background and manage the local study companion.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <StudentThemeSettings />
        <StudentCompanionWidget />
      </div>
    </StudentWorkspaceShell>
  )
}
