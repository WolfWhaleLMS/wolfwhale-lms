import { RoleLayout } from '@/lib/layouts/role-layout'

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleLayout role="teacher">{children}</RoleLayout>
}
