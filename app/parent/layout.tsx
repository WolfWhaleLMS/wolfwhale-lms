import { RoleLayout } from '@/lib/layouts/role-layout'

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleLayout role="parent">{children}</RoleLayout>
}
