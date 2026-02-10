import { requireRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AdminSettingsClient from './AdminSettingsClient';

export default async function AdminSettingsPage() {
  await requireRole(['admin', 'super_admin']);
  const tenantId = await getUserTenantId();
  const supabase = await createClient();

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No school found for your account.</p>
      </div>
    );
  }

  // Fetch tenant details
  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">School not found.</p>
      </div>
    );
  }

  return (
    <AdminSettingsClient
      tenant={{
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        description: tenant.description || '',
        logoUrl: tenant.logo_url || '',
        websiteUrl: tenant.website_url || '',
        address: tenant.address || '',
        city: tenant.city || '',
        state: tenant.state || '',
        postalCode: tenant.postal_code || '',
        country: tenant.country || '',
        phone: tenant.phone || '',
        subscriptionPlan: tenant.subscription_plan,
        status: tenant.status,
      }}
    />
  );
}
