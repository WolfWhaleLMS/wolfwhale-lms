import { NextRequest } from 'next/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError } from '@/lib/api';
import { createCheckoutSession } from '@/lib/stripe';
import { checkoutSessionSchema } from '@/lib/validation/schemas';

/**
 * POST /api/billing/checkout
 * Create Stripe checkout session
 */
export const POST = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const body = await req.json();

    // Validate request
    const validation = checkoutSessionSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

    const data = validation.data;

    // Create checkout session
    const checkoutUrl = await createCheckoutSession(
      opts.tenantId,
      data.priceId,
      data.successUrl,
      data.cancelUrl
    );

    return apiResponse({
      url: checkoutUrl,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);

    if (error.code === 'VALIDATION_ERROR') {
      return apiError(error.message, 400, error.code);
    }

    return apiError('Failed to create checkout session', 500, 'CHECKOUT_ERROR');
  }
});
