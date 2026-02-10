import { NextRequest, NextResponse } from 'next/server';
import { requireRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    await requireRole(['admin', 'super_admin']);
    const tenantId = await getUserTenantId();

    if (!tenantId) {
      return NextResponse.json(
        { error: 'No school found for your account' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const supabase = await createClient();

    // Only allow updating specific fields
    const allowedFields = [
      'name',
      'description',
      'website_url',
      'address',
      'city',
      'state',
      'postal_code',
      'country',
      'phone',
    ];

    const updateData: Record<string, string | null> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field] || null;
      }
    }

    // Ensure name is not empty
    if ('name' in updateData && !updateData.name) {
      return NextResponse.json(
        { error: 'School name cannot be empty' },
        { status: 400 }
      );
    }

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', tenantId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update settings: ' + error.message },
        { status: 500 }
      );
    }

    // Log the action
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { createAdminClient } = await import('@/lib/supabase/admin');
      const adminClient = createAdminClient();
      await adminClient.from('audit_logs').insert({
        tenant_id: tenantId,
        user_id: user.id,
        action: 'settings.updated',
        resource_type: 'settings',
        resource_id: tenantId,
        details: {
          description: 'Updated school settings',
          fields: Object.keys(updateData).filter((k) => k !== 'updated_at'),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Check if this is a redirect error from requireRole
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
