import { RoleLayout } from '@/lib/layouts/role-layout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleLayout role="admin">{children}</RoleLayout>
}
