import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { handleWebhookEvent } from '@/lib/stripe';
import { apiResponse, apiError } from '@/lib/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

/**
 * POST /api/billing/webhooks
 * Handle Stripe webhook events
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return apiError('Missing Stripe signature', 400, 'INVALID_SIGNATURE');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return apiError('Webhook not configured', 500, 'CONFIG_ERROR');
    }

    const body = await req.text();

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error);
      return apiError(`Webhook Error: ${error.message}`, 400, 'SIGNATURE_VERIFICATION_FAILED');
    }

    // Handle the event
    await handleWebhookEvent(event);

    return apiResponse({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return apiError('Failed to process webhook', 500, 'WEBHOOK_ERROR');
  }
}
