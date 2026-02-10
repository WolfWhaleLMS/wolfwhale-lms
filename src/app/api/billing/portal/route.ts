import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError } from '@/lib/api';
import { createPortalSession } from '@/lib/stripe';

/**
 * POST /api/billing/portal
 * Create Stripe customer portal session
 */
export const POST = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const { returnUrl } = await req.json();

    // Validate
    if (!returnUrl) {
      return apiError('Return URL is required', 400, 'VALIDATION_ERROR');
    }

    // Get tenant's Stripe customer ID
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('stripe_customer_id')
      .eq('id', opts.tenantId)
      .single();

    if (tenantError || !tenant) {
      return apiError('Tenant not found', 404, 'NOT_FOUND');
    }

    if (!tenant.stripe_customer_id) {
      return apiError('No billing account found for this tenant', 400, 'NO_ACCOUNT');
    }

    // Create portal session
    const portalUrl = await createPortalSession(tenant.stripe_customer_id, returnUrl);

    return apiResponse({
      url: portalUrl,
    });
  } catch (error: any) {
    console.error('Portal error:', error);

    if (error.code === 'VALIDATION_ERROR') {
      return apiError(error.message, 400, error.code);
    }

    return apiError('Failed to create portal session', 500, 'PORTAL_ERROR');
  }
});
