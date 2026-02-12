import { RoleLayout } from '@/lib/layouts/role-layout'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleLayout role="student">{children}</RoleLayout>
}
