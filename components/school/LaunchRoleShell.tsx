import { ClipboardCheck, LockKeyhole, ShieldAlert } from 'lucide-react'
import { LmsPanel, LmsShell } from '@/components/lms/LmsShell'
import type { RoleSurface } from '@/lib/school-launch/role-surfaces'

interface LaunchRoleShellProps {
  surface: RoleSurface
}

export function LaunchRoleShell({ surface }: LaunchRoleShellProps) {
  return (
    <LmsShell
      role={surface.role}
      title={surface.title}
      subtitle={surface.summary}
      tools={[
        { href: '#workflow-surface', label: 'Workflow surface', description: 'Primary role workflows', icon: ClipboardCheck },
        { href: '#access-status', label: 'Access status', description: 'Controlled pilot gate', icon: LockKeyhole },
        { href: '#required-before-real-data', label: 'Launch gates', description: 'Required before live data', icon: ShieldAlert },
      ]}
      schoolName="WolfWhale Pilot"
      userName={`${surface.role} launch`}
      homeHref="/"
      spotlight={{
        label: 'Controlled Pilot',
        title: surface.title,
        tag: surface.eyebrow,
        status: 'Locked',
        meta: ['Protected route shell', 'No live student records exposed'],
      }}
      statusItems={[
        { label: 'Access Gate', value: 'Pilot', tone: 'warn' },
        { label: 'Workflows', value: `${surface.primaryWorkflows.length}`, tone: 'info' },
        { label: 'Launch Gates', value: `${surface.requiredBeforeRealData.length}`, tone: 'info' },
      ]}
      feedback={{
        title: 'Required Before Real Data',
        name: surface.eyebrow,
        body: surface.requiredBeforeRealData[0] ?? 'Complete access-control proof before real data.',
      }}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <LmsPanel id="workflow-surface" title="Workflow surface">
          <ul className="grid gap-3">
            {surface.primaryWorkflows.map((workflow) => (
              <li key={workflow} className="rounded-[1rem] border border-white/70 bg-white/56 px-3 py-2 text-sm font-bold text-[#315f9a]">
                {workflow}
              </li>
            ))}
          </ul>
        </LmsPanel>

        <LmsPanel id="access-status" title="Access status">
          <p className="text-sm font-bold leading-7 text-[#315f9a]">
            This route is protected by pilot middleware until Supabase Auth, role sessions, and row-level security tests
            are connected end to end.
          </p>
        </LmsPanel>

        <LmsPanel id="required-before-real-data" title="Required before real data">
          <ul className="grid gap-3">
            {surface.requiredBeforeRealData.map((requirement) => (
              <li key={requirement} className="rounded-[1rem] border border-white/70 bg-white/56 px-3 py-2 text-sm font-bold text-[#315f9a]">
                {requirement}
              </li>
            ))}
          </ul>
        </LmsPanel>
      </div>
    </LmsShell>
  )
}
